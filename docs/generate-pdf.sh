# https://jdhao.github.io/2019/05/30/markdown2pdf_pandoc/ add more stuff
echo "generating pdf documentation"
echo "----------------------------"

echo "generating pdf from markdown"
pandoc README.md \
    --pdf-engine=xelatex \
    --standalone \
    -H header.tex \
    -o Readme.pdf
echo "done"

# echo "generating html from markdown"
# pandoc README.md \
#     --standalone \
#     -o Readme.html
# echo "done"
