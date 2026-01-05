# CSV Importer - WeWeb Component

Componente WeWeb para importação e mapeamento de arquivos CSV, com suporte a configuração dinâmica de colunas.

## 📋 Funcionalidades

- ✅ **Fluxo Guiado**: 3 passos claros (Upload, Verificação, Conclusão).
- ✅ **Upload Flexível**: Suporta drag & drop ou clique para upload de arquivos CSV.
- ✅ **Mapeamento Dinâmico**: Permite ao usuário definir quais colunas deseja extrair (ex: Nome, Email, WhatsApp, etc).
- ✅ **Personalização**: Cor primária configurável para se adequar ao design do app.
- ✅ **Exposição de Dados**: Disponibiliza os dados processados como variável bindable.

## ⚙️ Propriedades (Configuração)

O componente expõe as seguintes propriedades no painel do WeWeb:

| Propriedade | Tipo | Descrição |
|rag|rag|rag|
| **Columns to map** | Array | Lista dos campos de destino para o mapeamento. Cada item possui `Label` (exibido na UI) e `Value` (chave no JSON final). Default: Nome, Email, Whatsapp. |
| **Primary Color** | Color | Cor principal utilizada nos botões e indicadores de passo. |

## 📊 Variável Exposta

### `mappedData`

Array de objetos contendo os dados do CSV processados e mapeados para as chaves definidas na propriedade `Columns`.

**Tipo:** `Array<Object>`

**Exemplo:**

Suponha que você configurou as colunas de destino como:
- Label: "Nome Completo", Value: `nome`
- Label: "E-mail", Value: `email`
- Label: "Celular", Value: `wid`

E importou um CSV:
```csv
Col A,Col B,Col C
João Silva,joao@teste.com,(11) 99999-8888
```

O `mappedData` resultante será:
```json
[
  {
    "nome": "João Silva",
    "email": "joao@teste.com",
    "wid": "(11) 99999-8888"
  }
]
```

## 📤 Eventos (Triggers)

### `On Complete`

Ocorre quando o usuário finaliza com sucesso o fluxo de importação. Possui acesso imediato aos dados mapeados.

**Payload:**
```javascript
{
  mappedData: Array<Object> // Os mesmos dados disponíveis na variável
}
```

## 🎯 Como Usar

1. **Arraste o componente** para sua página no editor WeWeb.
2. **Configure as Colunas**: No painel de propriedades, defina quais campos você espera receber do CSV (ex: id, nome, status).
3. **Configure o Workflow**:
   - Selecione o componente.
   - Vá na aba de Workflows.
   - Adicione um trigger no evento **On Complete**.
   - Use o valor do evento (`event.mappedData`) ou a variável do componente (`mappedData`) para salvar os dados no seu backend (Xano, Supabase, etc) ou iterar sobre eles.

## 🎨 Estrutura do Componente

```
csv-import-ww/
├── src/
│   ├── components/
│   │   ├── ImporterStepper.vue       # Navegação entre passos
│   │   ├── ImporterStepUpload.vue    # Passo 1: Seleção de arquivo
│   │   ├── ImporterStepVerification.vue # Passo 2: De/Para de colunas
│   │   └── ImporterStepConclusion.vue   # Passo 3: Feedback final
│   └── wwElement.vue                 # Lógica central e orquestração
├── ww-config.js                      # Definição de propriedades e metadados WeWeb
└── package.json
```

## 🛠️ Desenvolvimento

```bash
# Instalar dependências
npm install

# Servir em modo desenvolvimento (watch)
npm run serve
```
