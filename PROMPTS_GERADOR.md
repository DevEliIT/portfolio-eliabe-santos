# 🤖 Prompts Prontos para Gerar Conteúdo (Projetos & Blog)

Este guia contém os **Prompts Mágicos** formatados exatamente com a estrutura dos campos do seu **Painel Admin (`/admin`)**. 

Basta copiar um dos prompts abaixo, colar na sua IA favorita (**ChatGPT, Claude, Gemini**), enviar o seu rascunho ou resumo do trabalho e a IA responderá tudo separado, pronto para você **Copiar e Colar**!

---

## 🚀 Prompt 1: Gerador Completo de Projetos para o Admin

Use este prompt sempre que concluir um projeto novo. Cole o prompt abaixo no ChatGPT e adicione um breve resumo do que você fez no projeto no final.

```text
Você é um Copywriter especialista em Portfólios de Desenvolvedores Front-end e UI/UX Designers de alto nível.

Vou te fornecer um resumo ou notas brutas sobre um projeto que desenvolvi. 
Sua tarefa é analisar as informações e gerar o conteúdo formatado EXATAMENTE no modelo dos campos abaixo, para que eu possa copiar e colar direto no formulário do meu Painel Admin.

--- MODELO DE RESPOSTA (Copie este formato exato) ---

1. TÍTULO DO PROJETO:
[Nome do projeto]

2. CATEGORIA:
[Escolha uma: Front-end | UI/UX Design | Mobile | Full-stack]

3. CLIENTE:
[Nome do cliente ou "Projeto Autoral" / "Projeto Pessoal"]

4. ANO:
[Ex: 2024]

5. SUA FUNÇÃO / PAPEL:
[Ex: Lead Front-end Developer & UI Designer]

6. SUBTÍTULO DO PROJETO:
[Frase de impacto sobre a solução criada]

7. RESUMO CURTO:
[2 a 3 frases resumo exibidas no card principal da listagem]

8. DESCRIÇÃO COMPLETA:
[Texto abrangente com 2 parágrafos detalhando a proposta do projeto]

9. TECNOLOGIAS UTILIZADAS (Separadas por vírgula):
[Ex: React, Next.js, TypeScript, Tailwind CSS, Supabase, Figma]

10. O DESAFIO:
[Explique qual era o problema principal ou necessidade técnica do cliente]

11. A SOLUÇÃO:
[Explique como sua arquitetura, design e código resolveram o desafio com maestria]

12. FUNCIONALIDADES PRINCIPAIS (Uma por linha):
- Funcionalidade 1
- Funcionalidade 2
- Funcionalidade 3
- Funcionalidade 4

---------------------------------------------------

Aqui estão as informações do meu projeto:
[COLE AQUI O SEU RESUMO OU NOTAS DO PROJETO]
```

---

## 📝 Prompt 2: Gerador de Artigos Otimizados para o Blog

Use este prompt para criar tutoriais, artigos de opinião técnica, boas práticas ou guia de ferramentas para a seção `/blog`.

```text
Você é um Tech Writer sênior e criador de conteúdo especializado em Desenvolvimento Front-end, Next.js, React, UI/UX e Arquitetura de Software.

Quero escrever um artigo para o meu blog pessoal.
Gere um artigo completo, técnico, moderno e envolvente com base no tema que vou informar abaixo.

Responda formatado EXATAMENTE segundo a estrutura de campos do meu Painel Admin:

--- MODELO DE RESPOSTA (Copie este formato exato) ---

1. TÍTULO DO ARTIGO:
[Título direto e atrativo para SEO]

2. CATEGORIA:
[Escolha uma: Desenvolvimento Web | Front-end | UI/UX Design | Carreira & Tech]

3. SUBTÍTULO / RESUMO CURTO:
[Resumo persuasivo de 2 frases que gera curiosidade]

4. TEMPO DE LEITURA:
[Ex: 5 min de leitura]

5. TAGS (Separadas por vírgula):
[Ex: Next.js, React, Performance, CSS]

6. CONTEÚDO DO ARTIGO (Em Markdown):
### Introdução
[Parágrafo de introdução contextualizando o tema]

### [Subtítulo Principal 1]
[Explicar o conceito principal com clareza. Use código de exemplo em blocos de código se for relevante.]

```tsx
// Exemplo de código limpo se aplicável
```

### [Subtítulo Principal 2]
[Tópicos práticos ou passo a passo das melhores práticas]

### Conclusão
[Resumo final e encerramento motivador]

---------------------------------------------------

Aqui está o tema / rascunho do meu artigo:
[DIGITE O TEMA OU IDEIA DO ARTIGO AQUI]
```

---

## 💡 Dicas de Uso

1. **Upload de Imagens**: Depois de preencher os dados gerados pela IA, basta usar o novo botão **"Escolher Imagem / Arrastar Arquivo"** do seu Admin para carregar a capa e galeria (que serão comprimidas automaticamente em WebP).
2. **Edição do Markdown**: No campo de **Conteúdo do Artigo**, você pode usar marcadores `###` para criar subtítulos bonitos com linha decorativa vermelha automaticamente.
