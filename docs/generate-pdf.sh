# https://jdhao.github.io/2019/05/30/markdown2pdf_pandoc/ add more stuff
echo "generating pdf documentation"
echo "----------------------------"

echo "creating build dir"

rm -rf build
mkdir -p build

echo "preprocessing markdown for mermaid diagrams"
pnpm dlx @mermaid-js/mermaid-cli mmdc -i README.md -e png -o ./build/preprocessed.md

echo "copying assets to build dir"
cp -r assets/ build/assets
cp header.tex build/header.tex

cd build

echo "generating pdf from markdown"
pandoc preprocessed.md \
    --pdf-engine=xelatex \
    --standalone \
    --highlight-style=zenburn \
    -H header.tex \
    -o Readme.pdf

echo "copying result to cwd dir"
mv Readme.pdf ../Readme.pdf

echo "cleaning up..."
cd ..
rm -fr build

echo "done"
