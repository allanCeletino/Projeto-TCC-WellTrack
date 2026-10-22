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
-- 1. Criar e selecionar a base de dados


CREATE DATABASE IF NOT EXISTS welltrack;
USE welltrack;

-- =========================
-- INSERÇÃO DE ALIMENTOS
-- =========================
INSERT INTO Alimento
(nome, categoria, calorias100g, proteinas100g, carboidratos100g, gorduras100g, fibras100g)
VALUES

-- PROTEÍNAS
('Ovo cozido', 'PROTEINAS', 146.00, 13.30, 0.60, 9.50, 0.00),
('Peito de frango grelhado', 'PROTEINAS', 159.00, 32.00, 0.00, 2.50, 0.00),
('Carne bovina grelhada', 'PROTEINAS', 219.00, 31.90, 0.00, 9.00, 0.00),
('Carne bovina cozida', 'PROTEINAS', 219.00, 31.70, 0.00, 9.00, 0.00),
('Peixe grelhado', 'PROTEINAS', 150.00, 26.00, 0.00, 5.00, 0.00),
('Sardinha assada', 'PROTEINAS', 164.00, 32.00, 0.00, 4.00, 0.00),
('Atum em água', 'PROTEINAS', 116.00, 25.00, 0.00, 1.00, 0.00),
('Carne suína grelhada', 'PROTEINAS', 242.00, 27.00, 0.00, 14.00, 0.00),

-- CARBOIDRATOS
('Arroz branco cozido', 'CARBOIDRATOS', 128.00, 2.50, 28.10, 0.20, 1.60),
('Arroz integral cozido', 'CARBOIDRATOS', 124.00, 2.60, 25.80, 1.00, 2.70),
('Macarrão cozido', 'CARBOIDRATOS', 157.00, 5.80, 30.70, 0.90, 1.80),
('Batata cozida', 'CARBOIDRATOS', 52.00, 1.20, 11.90, 0.10, 1.30),
('Batata-doce cozida', 'CARBOIDRATOS', 77.00, 0.60, 18.40, 0.10, 2.20),
('Mandioca cozida', 'CARBOIDRATOS', 125.00, 0.60, 30.10, 0.30, 1.60),
('Milho cozido', 'CARBOIDRATOS', 98.00, 3.20, 17.10, 2.40, 4.60),
('Cuscuz de milho cozido', 'CARBOIDRATOS', 112.00, 2.20, 25.30, 0.70, 2.00),

-- GORDURAS BOAS
('Abacate', 'GORDURA_BOA', 96.00, 1.20, 6.00, 8.40, 6.30),
('Azeite de oliva', 'GORDURA_BOA', 884.00, 0.00, 0.00, 100.00, 0.00),
('Castanha-do-pará', 'GORDURA_BOA', 656.00, 14.30, 12.20, 63.50, 7.90),
('Castanha-de-caju', 'GORDURA_BOA', 553.00, 18.20, 30.20, 43.80, 3.30),
('Amendoim torrado', 'GORDURA_BOA', 606.00, 22.50, 18.70, 54.00, 7.80);

-- =========================
-- INSERÇÃO DE TIPOS DE TREINO
-- =========================
INSERT INTO tipo_treino (nome, calorias_por_hora) VALUES
('Corrida Moderada', 600.00),
('Musculação', 350.00),
('Natação', 500.00),
('Ciclismo', 450.00),
('Caminhada Rápida', 280.00),
('Futebol', 650.00),
('Yoga', 180.00);
