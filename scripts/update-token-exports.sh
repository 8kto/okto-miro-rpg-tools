#!/bin/bash

# Navigate to the project root (assumes 'scripts' is at the same level as 'src')
cd "$(dirname "$0")/.."

# Directory containing the token images
TOKEN_DIR="src/images/tokens/rounded"
OUTPUT_FILE="src/data/tokenExports.ts"

# Start by clearing the output file
echo "// Auto-generated token exports" > "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

# Loop over each image file in the directory and generate import statements
for file in "$TOKEN_DIR"/*; do
    # Extract the base filename without extension
    filename=$(basename -- "$file")
    name="${filename%.*}"

    # Convert the name to PascalCase for the import variable
    exportName="$(echo "$name" | sed -r 's/(^|-)([a-z])/\U\2/g')Token"

    # Write the import statement to the output file
    echo "import $exportName from '../images/tokens/rounded/$filename'" >> "$OUTPUT_FILE"
done

# Add a newline before the export default
echo -e "\nconst tokens = {" >> "$OUTPUT_FILE"

# Loop again to generate the export object entries
for file in "$TOKEN_DIR"/*; do
    # Extract the base filename without extension
    filename=$(basename -- "$file")
    name="${filename%.*}"

    # Convert the name to PascalCase for the export variable
    exportName="$(echo "$name" | sed -r 's/(^|-)([a-z])/\U\2/g')Token"

    # Write the export object entry to the output file
    echo "  $exportName," >> "$OUTPUT_FILE"
done

# Close the export default object
echo "}" >> "$OUTPUT_FILE"
echo -e "\nexport default tokens" >> "$OUTPUT_FILE"
echo -e "\nexport type TokenDict = typeof tokens" >> "$OUTPUT_FILE"

echo "Exports have been written to $OUTPUT_FILE"
