echo "generating pdf documentation"
pandoc README.md \
    --pdf-engine=xelatex \
    --standalone \
    --toc \
    --toc-depth=6 \
    -V geometry:margin=30mm \
    -V monofont="Iosevka Nerd Font Mono" \
    -o Readme.pdf
