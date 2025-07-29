# 📋 Checkpoint do Projeto Iris Map

## 🔧 Refatorações Pendentes

### 📝 Padronização de Nomenclatura
- [ ] Revisar e padronizar nomes de variáveis, funções e componentes
- [ ] Estabelecer convenções de nomenclatura (camelCase, PascalCase, etc.)
- [ ] Atualizar imports e exports conforme padrão definido
- [ ] Documentar guia de estilo no README

### 🔄 Migração de Formulários Legacy
- [ ] **Login Form**: Migrar validação para Zod + React Hook Form
- [ ] **Registro**: Verificar se precisa de atualização
- [ ] **Perfil**: Avaliar necessidade de refatoração
- [ ] Padronizar estrutura de hooks customizados para formulários
- [ ] Implementar tratamento de erros consistente

### 🗺️ Sistema de Dados do Mapa
- [ ] **Substituir dados mockados** por integração real com API
- [ ] Implementar formulário de "Sugerir Local" funcional
- [ ] Conectar submissão com backend
- [ ] Adicionar validação de coordenadas
- [ ] Implementar feedback visual para usuário

## 🚀 Novas Funcionalidades

### 👤 Painel Administrativo
- [ ] **Interface Admin**: Criar dashboard para administradores
- [ ] **Validação de Locais**: Sistema de aprovação/rejeição
- [ ] **Gestão de Eventos**: CRUD completo para eventos
- [ ] **Moderação**: Ferramentas para moderar conteúdo
- [ ] **Analytics**: Métricas básicas de uso

### 🔐 Sistema de Convites
- [ ] **Geração de Convites**: Criar códigos únicos de convite
- [ ] **Validação**: Verificar convites durante cadastro
- [ ] **Expiração**: Implementar TTL para convites
- [ ] **Rastreamento**: Log de quem convidou quem
- [ ] **Interface**: Tela para envio de convites

## 🎯 Próximos Passos Sugeridos

### Prioridade Alta 🔴
1. Finalizar migração do formulário de login
2. Remover dados mockados do mapa
3. Implementar sistema básico de admin

### Prioridade Média 🟡
1. Padronização de nomenclatura
2. Sistema de convites
3. Validação de locais/eventos

### Prioridade Baixa 🟢
1. Analytics e métricas
2. Melhorias de UX/UI
3. Otimizações de performance

## 📝 Observações
- Considerar implementar testes unitários para novas funcionalidades
- Documentar APIs e fluxos principais
- Avaliar necessidade de middleware de autenticação/autorização