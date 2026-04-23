"""
Send a group email to all registered RoboTalk users.

Usage:
    pip install supabase markdown
    python scripts/send_blast.py email.md                                    # send to all
    python scripts/send_blast.py email.md --test a@mail.com b@mail.com       # test with specific addresses

The markdown file should have YAML-style frontmatter for the subject:

    ---
    subject: RoboTalk 2026 — See you on April 25!
    ---

    Hi **{{first_name}}**,

    We're excited to see you at RoboTalk 2026!

Reads credentials from .env.local in the project root.
Writes a log file to scripts/logs/ after each run.
"""

import smtplib
import time
import sys
from datetime import datetime
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from pathlib import Path
from supabase import create_client
import markdown

THROTTLE_SEC = 0.3  # 300ms between emails

# Irregular vocatives that don't follow suffix rules
VOCATIVE_EXCEPTIONS = {
    "Θεός": "Θεέ",
}

# Masculine -ος names that take -ε in vocative (learned/ancient forms)
_VOCATIVE_E_NAMES = {
    "Άγγελος", "Πέτρος", "Παύλος", "Μάρκος", "Φίλιππος",
    "Αλέξανδρος", "Θεόδωρος", "Νικόλαος", "Νικηφόρος",
    "Ευάγγελος", "Λεύτερος", "Ελευθέριος",
    "Χαράλαμπος", "Πρόδρομος", "Ανάργυρος", "Σπυρίδων",
}

def to_vocative(name: str) -> str:
    """Convert a Greek first name from nominative to vocative case.

    Rules (modern demotic Greek):
    - Explicit exceptions dict checked first
    - -ιος  → -ιε   (Δημήτριος → Δημήτριε, Γεώργιος → Γεώργιε)
    - -ος   → -ε    for learned/ancient names (Άγγελος → Άγγελε, Πέτρος → Πέτρε)
    - -ος   → -ο    for all other names (Γιώργος → Γιώργο, Χρήστος → Χρήστο, Νίκος → Νίκο)
    - -ής   → -ή    (Μιχαλής → Μιχαλή)
    - -ης   → -η    (Δημήτρης → Δημήτρη, Γιάννης → Γιάννη)
    - -ας   → -α    (Κώστας → Κώστα, Ανδρέας → Ανδρέα, Ηλίας → Ηλία)
    - -ις   → -ι    (Πάρις → Πάρι)
    - -εύς  → -εύ   (Οδυσσεύς → Οδυσσεύ)
    - -ων   → -ων   (no change, rare in first names)
    - -ώ/-α/-η/-ου  → no change (feminine names)
    - Latin/non-Greek names → no change
    """
    name = name.strip()
    if not name:
        return name

    if name in VOCATIVE_EXCEPTIONS:
        return VOCATIVE_EXCEPTIONS[name]

    # -ιος → -ιε (Γεώργιος, Δημήτριος, Αθανάσιος)
    if name.endswith("ιος"):
        return name[:-3] + "ιε"

    # -ος → -ε for learned names, -ο for demotic
    if name.endswith("ος"):
        if name in _VOCATIVE_E_NAMES:
            return name[:-2] + "ε"
        return name[:-2] + "ο"

    # -ής → -ή (Μιχαλής, Βασιλής)
    if name.endswith("ής"):
        return name[:-1]

    # -ης → -η (Δημήτρης, Γιάννης, Θανάσης)
    if name.endswith("ης"):
        return name[:-1]

    # -ας/-άς → -α/-ά (Κώστας, Ανδρέας, Ηλίας, Θωμάς, Λουκάς)
    if name.endswith("ας") or name.endswith("άς"):
        return name[:-1]

    # -ις → -ι
    if name.endswith("ις"):
        return name[:-1]

    # -εύς → -εύ
    if name.endswith("εύς"):
        return name[:-1]

    # -ούς → -ού (rare)
    if name.endswith("ούς"):
        return name[:-1]

    # Everything else (feminine -α/-η/-ώ/-ου, Latin names) → unchanged
    return name


def load_env(path: Path) -> dict[str, str]:
    env = {}
    for line in path.read_text().splitlines():
        line = line.strip()
        if not line or line.startswith("#"):
            continue
        key, _, value = line.partition("=")
        env[key.strip()] = value.strip()
    return env


def parse_email_file(path: Path) -> tuple[str, str]:
    """Parse a markdown file with frontmatter into (subject, html_body)."""
    text = path.read_text(encoding="utf-8")

    if not text.startswith("---"):
        sys.exit("Markdown file must start with --- frontmatter containing 'subject:'")

    _, frontmatter, body = text.split("---", 2)

    subject = ""
    for line in frontmatter.strip().splitlines():
        key, _, value = line.partition(":")
        if key.strip().lower() == "subject":
            subject = value.strip()

    if not subject:
        sys.exit("Frontmatter must contain 'subject: ...'")

    body = body.strip()
    if not body:
        sys.exit("Markdown body is empty.")

    html_body = markdown.markdown(body)
    return subject, html_body


def find_user_by_email(sb, email: str):
    """Paginate through auth users to find one by email."""
    page = 1
    per_page = 100
    while True:
        batch = sb.auth.admin.list_users(page=page, per_page=per_page)
        for u in batch:
            if u.email == email:
                return u
        if len(batch) < per_page:
            break
        page += 1
    return None


def main():
    if len(sys.argv) < 2:
        sys.exit("Usage: python scripts/send_blast.py <email.md> [--test email1 email2 ...] [--yes]")

    md_path = Path(sys.argv[1])
    if not md_path.exists():
        sys.exit(f"File not found: {md_path}")

    # Check for flags
    auto_confirm = "--yes" in sys.argv

    test_emails = []
    if "--test" in sys.argv:
        idx = sys.argv.index("--test")
        test_emails = [a for a in sys.argv[idx + 1:] if not a.startswith("--")]
        if not test_emails:
            sys.exit("--test requires at least one email address")

    subject, html_template = parse_email_file(md_path)

    # Load .env.local
    env_path = Path(__file__).resolve().parent.parent / ".env.local"
    if not env_path.exists():
        sys.exit(f"Missing {env_path}")
    env = load_env(env_path)

    gmail_user = env["GMAIL_USER"]
    gmail_pass = env["GMAIL_APP_PASSWORD"]

    supabase_url = env["NEXT_PUBLIC_SUPABASE_URL"]
    service_key = env["SUPABASE_SERVICE_ROLE_KEY"]
    sb = create_client(supabase_url, service_key)

    if test_emails:
        # Test mode — look up each email in auth + profiles
        users = []
        for email in test_emails:
            match = find_user_by_email(sb, email)
            if not match:
                print(f"  WARNING: No auth user found for {email}, skipping.")
                continue
            profile = sb.table("profiles").select("first_name").eq("id", match.id).single().execute().data
            first_name = profile.get("first_name", "") if profile else ""
            users.append({"email": email, "first_name": first_name})
            print(f"  Found: {email} ({first_name})")
        if not users:
            sys.exit("No valid test users found.")
        print(f"\nTEST MODE — sending to {len(users)} user(s)\n")
    else:
        # Fetch all profiles
        profiles = sb.table("profiles").select("id, first_name").execute().data
        print(f"Found {len(profiles)} registered users.\n")

        if not profiles:
            sys.exit("No profiles found.")

        # Fetch emails from auth for each user
        users = []
        for p in profiles:
            try:
                auth_user = sb.auth.admin.get_user_by_id(p["id"])
                email = auth_user.user.email
                if email:
                    users.append({"email": email, "first_name": p.get("first_name", "")})
            except Exception as e:
                print(f"  Could not fetch auth for {p['id']}: {e}")

        print(f"Resolved {len(users)} emails.\n")

    # Confirm
    print(f"--- Preview ---")
    print(f"From: {md_path.name}")
    print(f"To: {len(users)} {'user(s) (test)' if test_emails else 'users'}")
    print(f"Subject: {subject}")
    print(f"Body:\n{html_template[:500]}\n")
    if auto_confirm:
        print("--yes flag provided, skipping confirmation.\n")
    else:
        confirm = input("Send? (yes/no): ").strip().lower()
        if confirm != "yes":
            sys.exit("Aborted.")

    # Prepare log
    log_dir = Path(__file__).resolve().parent / "logs"
    log_dir.mkdir(exist_ok=True)
    timestamp = datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
    mode = "test" if test_emails else "blast"
    log_path = log_dir / f"{mode}_{timestamp}.log"

    log_lines = []
    log_lines.append(f"Email Blast Log — {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    log_lines.append(f"Mode: {'TEST' if test_emails else 'BLAST'}")
    log_lines.append(f"Template: {md_path.name}")
    log_lines.append(f"Subject: {subject}")
    log_lines.append(f"Recipients: {len(users)}")
    log_lines.append("=" * 60)

    # Send
    def connect_smtp():
        s = smtplib.SMTP_SSL("smtp.gmail.com", 465)
        s.login(gmail_user, gmail_pass)
        return s

    smtp = connect_smtp()

    sent = 0
    failed = []
    errors = []

    for u in users:
        name = to_vocative(u["first_name"])
        personalized = html_template.replace("{{first_name}}", name)

        msg = MIMEMultipart("alternative")
        msg["From"] = f"RoboTalk <{gmail_user}>"
        msg["To"] = u["email"]
        msg["Subject"] = subject
        msg.attach(MIMEText(personalized, "html"))

        for attempt in range(2):
            try:
                smtp.sendmail(gmail_user, u["email"], msg.as_string())
                sent += 1
                status = f"[OK]    {u['email']} ({name})"
                print(f"  [{sent}/{len(users)}] Sent to {u['email']} ({name})")
                break
            except smtplib.SMTPServerDisconnected:
                if attempt == 0:
                    print(f"  Connection lost, reconnecting...")
                    try:
                        smtp = connect_smtp()
                    except Exception:
                        pass
                    continue
                failed.append(u["email"])
                errors.append(f"{u['email']}: connection lost")
                status = f"[FAIL]  {u['email']} ({name}) — connection lost"
                print(f"  FAILED {u['email']}: connection lost")
            except Exception as e:
                failed.append(u["email"])
                errors.append(f"{u['email']}: {e}")
                status = f"[FAIL]  {u['email']} ({name}) — {e}"
                print(f"  FAILED {u['email']}: {e}")
                break

        log_lines.append(status)
        time.sleep(THROTTLE_SEC)

    try:
        smtp.quit()
    except Exception:
        pass

    # Summary
    log_lines.append("=" * 60)
    log_lines.append(f"SUMMARY")
    log_lines.append(f"  Total:  {len(users)}")
    log_lines.append(f"  Sent:   {sent}")
    log_lines.append(f"  Failed: {len(failed)}")
    if errors:
        log_lines.append(f"\nERRORS:")
        for err in errors:
            log_lines.append(f"  - {err}")

    # Write log
    log_path.write_text("\n".join(log_lines), encoding="utf-8")

    print(f"\nDone. Sent: {sent} | Failed: {len(failed)}")
    print(f"Log saved to: {log_path}")
    if failed:
        print("Failed addresses:")
        for f in failed:
            print(f"  - {f}")


if __name__ == "__main__":
    main()
