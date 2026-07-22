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

## 📝 Prompt 2: Gerador de Artigos Ricos em Markdown para o Blog

Use este prompt para criar tutoriais, guias, comparações de tecnologias e artigos técnicos com **Tabelas**, **Blocos de Código**, **Citações**, **Listas** e **Títulos Formatados**.

```text
Você é um Tech Writer sênior e criador de conteúdo técnico especializado em Desenvolvimento Front-end, Next.js, React, TypeScript, UI/UX e Arquitetura de Software.

Quero escrever um artigo rico para o meu blog pessoal.
Gere um artigo completo, profundo e envolvente com base no tema que vou informar abaixo.

Atenção: O conteúdo do artigo DEVE usar sintaxe Markdown completa e limpa (incluindo títulos ## e ###, citações com >, blocos de código ```tsx, tabelas em Markdown e listas com -).

Responda formatado EXATAMENTE segundo a estrutura de campos do meu Painel Admin:

--- MODELO DE RESPOSTA (Copie este formato exato) ---

1. TÍTULO DO ARTIGO:
[Título direto, atrativo e otimizado para SEO]

2. CATEGORIA:
[Escolha uma: Desenvolvimento Web | Front-end | UI/UX Design | Carreira & Tech]

3. SUBTÍTULO / RESUMO CURTO:
[Resumo persuasivo de 2 a 3 frases]

4. TEMPO DE LEITURA:
[Ex: 6 min de leitura]

5. TAGS (Separadas por vírgula):
[Ex: Next.js, React, Design System, TypeScript]

6. CONTEÚDO DO ARTIGO (Copie o Markdown abaixo integralmente):

> [Citação de impacto ou resumo do artigo em blockquote]

---

## Introdução

[Parágrafos de introdução contextualizando o tema com clareza.]

---

## [Subtítulo Principal 1]

[Explicação técnica abrangente com listas e explicações claras.]

- **Ponto 1**: Detalhe do primeiro aspecto.
- **Ponto 2**: Detalhe do segundo aspecto.

### Exemplo Prático de Código

```tsx
// Código limpo e bem comentado
export function Exemplo() {
  return <div>Design System</div>;
}
```

---

## [Subtítulo Principal 2 - Tabela Comparativa ou Ferramentas]

| Ferramenta | Finalidade | Vantagem |
|------------|------------|----------|
| React | Componentes | Reutilização |
| TypeScript | Tipagem | Segurança de código |
| Storybook | Documentação | Visualização isolada |

---

## Conclusão

[Conclusão inspiradora e resumo das recomendações finais.]

---------------------------------------------------

Aqui está o tema / rascunho do meu artigo:
[DIGITE O TEMA OU IDEIA DO ARTIGO AQUI]
```

---

## 💡 Recursos Suportados no Leitor do Blog

O leitor do blog agora suporta nativamente todas as marcações Markdown:

- **Títulos (`##` e `###`)**: Formatados em caixa alta com linha de destaque vermelha à esquerda.
- **Citações (`> `)**: Caixas destacadas em itálico com fundo translúcido escuro.
- **Blocos de Código (```tsx ... ```)**: Caixas de código escuras com identificador de linguagem e fonte mono-espaçada verde.
- **Tabelas (`| Header | Header |`)**: Tabelas responsivas estilizadas com cabeçalhos vermelhos e linhas zebra.
- **Listas (`- ` ou `1. `)**: Listas organizadas com espaçamento e marcadores alinhados.
- **Linhas Divisórias (`---`)**: Linhas finas elegantes para separação de tópicos.
