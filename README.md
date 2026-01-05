# CSV Importer - WeWeb Component

Componente WeWeb para importação e mapeamento de arquivos CSV.

## 📋 Funcionalidades

- ✅ Upload de arquivos CSV via drag & drop ou clique
- ✅ Visualização e verificação dos dados importados
- ✅ Mapeamento de colunas CSV para campos personalizados
- ✅ Opção de ignorar cabeçalho
- ✅ Exposição de dados mapeados como variável de componente

## 🔧 Instalação

```bash
npm install
npm run serve
```

## 📊 Variável Exposta

### `mappedData`

Array de objetos com os dados do CSV mapeados de acordo com a configuração do usuário.

**Tipo:** `Array<Object>`

**Exemplo:**

Se o CSV contém:
```csv
Nome,Email,Telefone
João,joao@email.com,123456789
Maria,maria@email.com,987654321
```

E o mapeamento é:
- Coluna 0 → "name"
- Coluna 1 → "email"
- Coluna 2 → "phone"

O `mappedData` será:
```javascript
[
  { name: "João", email: "joao@email.com", phone: "123456789" },
  { name: "Maria", email: "maria@email.com", phone: "987654321" }
]
```

## 🎯 Como Usar no WeWeb

1. **Adicione o componente** à sua página
2. **Configure um workflow** no evento "On Import"
3. **Acesse a variável** `mappedData` através de:
   - `[component_uid].mappedData` em bindings
   - Variável de componente no painel de variáveis

## 📤 Eventos

### `import`

Disparado quando o usuário completa o processo de importação.

**Payload:**
```javascript
{
  data: Array,           // Dados brutos do CSV
  mapping: Object,       // Mapeamento de colunas
  ignoreHeader: Boolean, // Se o cabeçalho foi ignorado
  mappedData: Array      // Dados mapeados (array de objetos)
}
```

## 🎨 Estrutura do Componente

```
csv-import-ww/
├── src/
│   ├── components/
│   │   ├── ImporterStepper.vue       # Indicador de passos
│   │   ├── ImporterStepUpload.vue    # Passo 1: Upload
│   │   ├── ImporterStepVerification.vue # Passo 2: Verificação
│   │   └── ImporterStepConclusion.vue   # Passo 3: Conclusão
│   └── wwElement.vue                 # Componente principal
├── ww-config.js                      # Configuração WeWeb
└── package.json
```

## 🔄 Fluxo de Importação

1. **Upload** - Usuário faz upload do arquivo CSV
2. **Verificação** - Visualiza os dados e mapeia as colunas
3. **Conclusão** - Confirma e os dados são expostos via `mappedData`

## 🛠️ Desenvolvimento

```bash
# Instalar dependências
npm install

# Servir em modo desenvolvimento
npm run serve

# Build para produção
npm run build
```

## 📦 Dependências

- `papaparse` - Parser de CSV
- `@weweb/cli` - CLI do WeWeb (dev)
