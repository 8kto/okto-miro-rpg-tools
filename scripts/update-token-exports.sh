#!/bin/bash

# Navigate to the project root (assumes 'scripts' is at the same level as 'src')
cd "$(dirname "$0")/.."

# Directory containing the token images
TOKEN_DIR="src/images/tokens/"
OUTPUT_FILE="src/data/tokenAutoExports.ts"

# Start by clearing the output file
echo "// Auto-generated token exports (Lazy Loaded)" > "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

toPascalCase() {
  echo "$1" | sed -r 's/[^a-zA-Z0-9]+/_/g; s/(^|_)([a-z])/\U\2/g; s/^/Token/; s/\.png$//'
}

# Add the opening of the tokens object
echo "const tokens = {" >> "$OUTPUT_FILE"

# Loop over each image file and folder within the TOKEN_DIR (1 level deep)
find "$TOKEN_DIR" -mindepth 1 -maxdepth 2 -type f -name "*.png" | while read -r file; do
    # Extract the base filename without extension
    filename=$(basename -- "$file")
    name="${filename%.*}"

    # Convert the name to PascalCase for the import variable
    exportName="$(toPascalCase "$name")"

    # Calculate the relative path, removing the TOKEN_DIR prefix
    relative_path="../images/tokens/${file#"$TOKEN_DIR"}"

    # Write the dynamic import statement inside the tokens object
    echo "  $exportName: () => import('$relative_path')," >> "$OUTPUT_FILE"
done

# Close the tokens object
echo "}" >> "$OUTPUT_FILE"

# Add the export statements
echo -e "\nexport default tokens" >> "$OUTPUT_FILE"

echo "Lazy-loaded exports have been written to $OUTPUT_FILE"
