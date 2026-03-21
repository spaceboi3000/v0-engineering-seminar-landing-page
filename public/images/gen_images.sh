#!/bin/bash

DIR="public/images/sponsors"

mkdir -p "$DIR"

files=(
  titan-electronics.png
  quantum-motors.png
  helios-energy.png
  vertex-software.png
  aether-labs.png
  forge-materials.png
  neural-dynamics.png
  acme-robotics.png
)

for f in "${files[@]}"; do
  name="${f%.png}"
  convert -size 400x200 xc:#eeeeee \
    -gravity center \
    -pointsize 24 \
    -fill black \
    -annotate 0 "$name" \
    "$DIR/$f"
done

echo "Dummy sponsor images created in $DIR"
