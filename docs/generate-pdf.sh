# https://jdhao.github.io/2019/05/30/markdown2pdf_pandoc/ add more stuff
echo "generating pdf documentation"
pandoc README.md \
    --pdf-engine=xelatex \
    --standalone \
    --highlight-style=zenburn \
    -H header.tex \
    -o Readme.pdf
