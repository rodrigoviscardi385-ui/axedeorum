# Axé de Orum

Guias Artesanais de Umbanda e Candomblé — site estático.

- **Criador de guias:** cores, fios, firma, pingentes e extras com preview 3D
- **Canal de pedido:** WhatsApp
- **Hospedagem:** Netlify (headers de segurança em `_headers`/`netlify.toml`)
- **Deploy:** automático via Git (Netlify conectado ao repositório)

## Estrutura

```
site/
  index.html    página principal
  app.js        lógica do criador
  style.css     estilos
  _headers      headers de segurança (Netlify)
  netlify.toml  config Netlify
  robots.txt    SEO
  sitemap.xml   SEO
  assets/       imagens
    pingentes/  fotos dos pingentes ({id}.png — substitua pelas fotos reais)
```

## Como trocar pelas fotos reais

Substitua os arquivos em `assets/pingentes/{id}.png` — o site usa a imagem
automaticamente. Se o arquivo não existir, o ícone SVG (desenho) é usado.
