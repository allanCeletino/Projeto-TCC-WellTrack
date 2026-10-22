# 🏋️‍♂️ WellTrack - Plataforma Web para Gerenciamento de Hábitos Saudáveis

O **WellTrack** é uma plataforma web desenvolvida para auxiliar no acompanhamento e na organização de hábitos diários focados em saúde e qualidade de vida, integrando monitoramento de exercícios, alimentação, sono e metas pessoais em um único ambiente.

---

## 🛠️ Tecnologias Utilizadas

* **Front-end:** React, JavaScript (ES6+), HTML5, CSS3
* **Back-end:** Java 21, Spring Boot, Spring Security (JWT), Spring Data JPA / Hibernate
* **Banco de Dados:** MySQL
* **Ferramentas e IDEs:** VS Code, Eclipse IDE, Postman, Git, GitHub, VMware

---

## ⚙️ Pré-requisitos para Execução

Antes de iniciar a aplicação, certifique-se de ter instalado em sua máquina:

1. **Java JDK 21** ou superior instalado e configurado nas variáveis de ambiente.
2. **Node.js** (versão 18+ ou a versão LTS mais atual) e gerenciador de pacotes **npm**.
3. **MySQL Server** em execução na porta padrão (`3306`).

---

## Verifique se as credenciais no arquivo de configuração do Back-end

**spring.datasource.url=jdbc:mysql://localhost:3306/welltrack
**spring.datasource.username=seu_usuario
**spring.datasource.password=sua_senha

---

## Executando o Back-end (Java / Spring Boot)

1. **Abra a pasta do projeto Back-end na sua IDE de preferência (Eclipse, VS Code ou IntelliJ).
2. **Localize a classe principal de inicialização do projeto (WelltrackApplication.java).
3. **Execute a classe principal como uma aplicação Java (Run as Java Application / Spring Boot App).
4. **Alternativamente, você pode rodar via terminal na raiz do projeto: "Bash" depois mvn "spring-boot:run"

---

## Executando o Front-end (React)
1. **Abra a pasta do projeto Front-end (Front-end WellTrack) no VS Code ou terminal.
2. **Se necessário, ajuste as variáveis de acesso/autenticação no arquivo de configuração do Front-end informando o usuário e senha configurados na API.
3. **Instale todas as dependências do projeto executando o comando:
Bash
npm install

5. **Inicie o servidor de desenvolvimento:
Bash
npm start

6. **A aplicação web será aberta automaticamente no seu navegador no endereço: http://localhost:3000

---

## 🚀 Como Executar o Projeto

### 1. Configuração do Banco de Dados (MySQL)
1. Abra seu gerenciador MySQL (ex.: MySQL Workbench ou via terminal).
2. Crie a base de dados do projeto e execute os scripts de criação das tabelas/massa de dados disponibilizados no repositório:
   ```sql
   CREATE DATABASE welltrack;