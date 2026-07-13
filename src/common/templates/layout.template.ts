// src/common/templates/layout.template.ts

export const emailLayout = (content: string) => `
<!DOCTYPE html>

<html>

<head>

<meta charset="UTF-8"/>

<style>

body{

background:#f5f5f5;

font-family:Arial,sans-serif;

margin:0;

padding:40px;

}

.container{

background:white;

max-width:650px;

margin:auto;

padding:40px;

border-radius:8px;

}

.footer{

margin-top:40px;

font-size:12px;

color:#888;

text-align:center;

}

</style>

</head>

<body>

<div class="container">

${content}

<div class="footer">

© ${new Date().getFullYear()} ScaffSnapp

</div>

</div>

</body>

</html>
`;
