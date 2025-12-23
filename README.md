# MarketList

Aplicativo mobile desenvolvido com React Native e Expo para gerenciamento de listas de compras.

## 📋 Sobre o Projeto

MarketList é um aplicativo multiplataforma desenvolvido com Expo e React Native, permitindo que os usuários criem e gerenciem suas listas de compras de forma simples e intuitiva.

## 🚀 Tecnologias Utilizadas

### Core
- **React Native**: `0.81.5` - Framework para desenvolvimento mobile multiplataforma
- **React**: `19.1.0` - Biblioteca JavaScript para construção de interfaces
- **Expo**: `~54.0.30` - Framework e plataforma para desenvolvimento React Native
- **TypeScript**: `~5.9.2` - Superset do JavaScript com tipagem estática

### Navegação e Roteamento
- **Expo Router**: `~6.0.21` - Sistema de roteamento baseado em arquivos para Expo
- **React Navigation**: `^7.1.8` - Biblioteca de navegação para React Native

### UI e Animações
- **React Native Reanimated**: `~4.1.1` - Biblioteca de animações de alto desempenho
- **React Native Worklets**: `0.5.1` - Suporte para worklets do Reanimated
- **Expo Vector Icons**: `^15.0.3` - Ícones vetoriais para o aplicativo
- **React Native Safe Area Context**: `~5.6.0` - Gerenciamento de áreas seguras
- **React Native Screens**: `~4.16.0` - Otimização de navegação nativa

### Outras Dependências
- **Expo Font**: `~14.0.10` - Carregamento de fontes customizadas
- **Expo Splash Screen**: `~31.0.13` - Tela de splash personalizada
- **Expo Status Bar**: `~3.0.9` - Controle da barra de status
- **Expo Constants**: `~18.0.12` - Constantes do ambiente Expo
- **Expo Linking**: `~8.0.11` - Deep linking e URL schemes
- **Expo Web Browser**: `~15.0.10` - Abertura de navegadores externos
- **React Native Web**: `~0.21.0` - Suporte para web

## 📱 Plataformas Suportadas

- ✅ iOS
- ✅ Android
- ✅ Web

## 📦 Versão do Projeto

**Versão**: `1.0.0`

## 🛠️ Pré-requisitos

Antes de começar, você precisa ter instalado em sua máquina:

- **Node.js** (versão 18 ou superior)
- **npm** ou **yarn** (gerenciador de pacotes)
- **Expo CLI** (instalado globalmente ou via npx)
- Para desenvolvimento iOS: **Xcode** (apenas no macOS)
- Para desenvolvimento Android: **Android Studio** e **Android SDK**

## 📥 Instalação

1. Clone o repositório:
```bash
git clone <url-do-repositorio>
cd marketlist
```

2. Instale as dependências:
```bash
npm install
```

ou

```bash
yarn install
```

## ▶️ Como Rodar o Projeto

### Desenvolvimento Local

Para iniciar o servidor de desenvolvimento:

```bash
npm start
```

ou

```bash
yarn start
```

Isso abrirá o Expo DevTools no seu navegador. Você pode então:

- Pressionar `i` para abrir no simulador iOS
- Pressionar `a` para abrir no emulador Android
- Pressionar `w` para abrir no navegador web
- Escanear o QR code com o app Expo Go no seu dispositivo físico

### Executar em Plataformas Específicas

#### iOS
```bash
npm run ios
```

ou

```bash
yarn ios
```

#### Android
```bash
npm run android
```

ou

```bash
yarn android
```

#### Web
```bash
npm run web
```

ou

```bash
yarn web
```

## 📁 Estrutura do Projeto

```
marketlist/
├── app/                    # Rotas do Expo Router
│   ├── _layout.tsx        # Layout raiz da aplicação
│   ├── (tabs)/            # Grupo de rotas com tabs
│   │   ├── _layout.tsx    # Layout das tabs
│   │   ├── index.tsx      # Tela inicial
│   │   └── two.tsx        # Segunda tela
│   ├── modal.tsx          # Tela modal
│   └── +not-found.tsx     # Página 404
├── assets/                 # Recursos estáticos
│   ├── fonts/             # Fontes customizadas
│   └── images/            # Imagens e ícones
├── components/             # Componentes reutilizáveis
├── constants/             # Constantes da aplicação
└── package.json           # Dependências e scripts
```

## 🎨 Características

- ✅ Navegação baseada em arquivos com Expo Router
- ✅ Suporte a temas claro/escuro automático
- ✅ Animações fluidas com Reanimated
- ✅ Suporte multiplataforma (iOS, Android, Web)
- ✅ TypeScript para type safety
- ✅ Nova arquitetura do React Native habilitada

## 📝 Scripts Disponíveis

- `npm start` - Inicia o servidor de desenvolvimento Expo
- `npm run ios` - Inicia no simulador iOS
- `npm run android` - Inicia no emulador Android
- `npm run web` - Inicia no navegador web

## 🔧 Configuração

O arquivo `app.json` contém as configurações do Expo, incluindo:
- Nome e slug do aplicativo
- Ícones e splash screen
- Configurações específicas por plataforma
- Plugins do Expo

## 📄 Licença

Este projeto é privado.

## 👨‍💻 Desenvolvimento

Para contribuir com o projeto:

1. Faça um fork do repositório
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

---

Desenvolvido com ❤️ usando Expo e React Native

