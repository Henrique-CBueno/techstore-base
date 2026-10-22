import { expect, test } from '@playwright/test'

const produtos = [
  {
    id: 'camiseta',
    title: 'Camiseta Básica',
    image: 'https://example.com/camiseta.jpg',
    price: 150,
    precoOriginal: 200,
    category: 'roupas',
    description: 'Camiseta confortável.',
    estoque: 2,
    rating: { rate: 4.8, count: 20 },
  },
  {
    id: 'notebook',
    title: 'Notebook Pro',
    image: 'https://example.com/notebook.jpg',
    price: 250,
    category: 'eletronicos',
    description: 'Notebook para trabalho.',
    estoque: 1,
    rating: { rate: 4.9, count: 30 },
  },
  {
    id: 'fone-esgotado',
    title: 'Fone Esgotado',
    image: 'https://example.com/fone.jpg',
    price: 80,
    category: 'eletronicos',
    description: 'Produto temporariamente indisponível.',
    estoque: 0,
    rating: { rate: 4.2, count: 10 },
  },
  {
    id: 'produto-sem-preco',
    title: 'Produto Sem Preço',
    image: 'https://example.com/sem-preco.jpg',
    category: 'casa',
    description: 'Aguardando preço.',
    estoque: 5,
    rating: { rate: 4, count: 5 },
  },
]

const clientes = [
  { id: 'cliente-novo', nome: 'Ana Souza', email: 'ana@example.com', pedidosAnteriores: 0 },
  { id: 'cliente-antigo', nome: 'Bruno Lima', email: 'bruno@example.com', pedidosAnteriores: 2 },
]

async function prepararApi(page, { falharProdutos = false, falharClientes = false } = {}) {
  await page.route('**/products.json', (route) => {
    if (falharProdutos) {
      return route.fulfill({ status: 503, body: 'indisponível' })
    }
    return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(produtos) })
  })
  await page.route('**/customers.json', (route) => {
    if (falharClientes) {
      return route.fulfill({ status: 503, body: 'indisponível' })
    }
    return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(clientes) })
  })
  await page.route('https://example.com/**', (route) => route.fulfill({ status: 200, body: '' }))
}

test.beforeEach(async ({ page }) => {
  await prepararApi(page)
})

test('filtra a vitrine e não exibe produtos sem estoque ou sem preço', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByRole('heading', { name: 'Produtos' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Camiseta Básica' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Notebook Pro' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Fone Esgotado' })).toHaveCount(0)
  await expect(page.getByRole('heading', { name: 'Produto Sem Preço' })).toHaveCount(0)

  await page.getByRole('button', { name: 'Eletrônicos' }).click()
  await expect(page.getByRole('heading', { name: 'Notebook Pro' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Camiseta Básica' })).toHaveCount(0)
})

test('adiciona produto, aplica cupom de primeira compra e remove uma unidade', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('article').filter({ hasText: 'Camiseta Básica' }).getByRole('button', { name: 'Adicionar ao carrinho' }).click()
  await expect(page.getByText('1 item')).toBeVisible()
  await page.getByRole('link', { name: 'Carrinho' }).click()

  await expect(page.locator('.item-preco')).toHaveText('R$ 150,00')
  await page.getByLabel('Cupom de desconto').fill('primeiracompra')
  await page.getByRole('button', { name: 'Aplicar' }).click()
  await expect(page.getByText('Cupom aplicado!')).toBeVisible()
  await expect(page.locator('.total')).toContainText('R$ 135,00')

  await page.getByRole('button', { name: 'Remover 1' }).click()
  await expect(page.getByText('Seu carrinho está vazio.')).toBeVisible()
})

test('não ultrapassa o estoque mesmo com cliques repetidos', async ({ page }) => {
  await page.goto('/')
  const card = page.getByRole('article').filter({ hasText: 'Camiseta Básica' })
  const adicionar = card.getByRole('button', { name: 'Adicionar ao carrinho' })

  await adicionar.click()
  await adicionar.click()
  await adicionar.click()
  await page.getByRole('button', { name: 'Entendi' }).click()
  await page.getByRole('link', { name: 'Carrinho' }).click()

  await expect(page.getByText('2 un.')).toBeVisible()
  await expect(page.getByText('R$ 300,00')).toBeVisible()
})

test('permite pedir reposição por link direto e mostra o interessado no estoque', async ({ page }) => {
  await page.goto('/produto/fone-esgotado')

  await expect(page.getByRole('heading', { name: 'Fone Esgotado' })).toBeVisible()
  await page.getByRole('button', { name: 'Produto indisponível' }).click()
  await expect(page.getByRole('alertdialog')).toContainText('produto está indisponível')
  await page.getByRole('button', { name: 'Entendi' }).click()
  const aviso = page.getByRole('button', { name: 'Avise-me quando voltar' })
  await aviso.click()
  await expect(page.getByRole('button', { name: 'Aviso solicitado' })).toBeDisabled()

  await page.getByRole('link', { name: 'Estoque' }).click()
  const linha = page.getByRole('row').filter({ hasText: 'Fone Esgotado' })
  await expect(linha).toContainText('Ana Souza')
  await expect(linha).toContainText('ana@example.com')
})

test('informa quando a quantidade máxima do estoque já foi atingida', async ({ page }) => {
  await page.goto('/')
  const card = page.getByRole('article').filter({ hasText: 'Camiseta Básica' })
  const adicionar = card.getByRole('button', { name: 'Adicionar ao carrinho' })

  await adicionar.click()
  await adicionar.click()
  await adicionar.click()

  await expect(page.getByRole('alertdialog')).toContainText('limite de 2 unidade(s)')
  await expect(page.getByRole('button', { name: 'Entendi' })).toBeVisible()
  await page.getByRole('button', { name: 'Entendi' }).click()
  await expect(page.getByText('2 itens')).toBeVisible()
})

test('não aceita cupom de primeira compra para cliente que já comprou', async ({ page }) => {
  await page.goto('/')
  await page.getByLabel('Cliente de teste').selectOption('cliente-antigo')
  await page.getByRole('article').filter({ hasText: 'Notebook Pro' }).getByRole('button', { name: 'Adicionar ao carrinho' }).click()
  await page.getByRole('link', { name: 'Carrinho' }).click()

  await page.getByLabel('Cupom de desconto').fill('PRIMEIRACOMPRA')
  await page.getByRole('button', { name: 'Aplicar' }).click()
  await expect(page.getByText('Cupom inválido')).toBeVisible()
  await expect(page.locator('.resumo-linha')).toHaveCount(0)
})

test('exibe erro quando a API de produtos falha', async ({ page }) => {
  await page.unroute('**/products.json')
  await page.route('**/products.json', (route) => route.fulfill({ status: 503, body: 'indisponível' }))
  await page.goto('/')

  await expect(page.getByText('Não foi possível carregar os produtos.')).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Produtos' })).toHaveCount(0)
})

test('informa falha independente ao carregar clientes', async ({ page }) => {
  await page.unroute('**/customers.json')
  await page.route('**/customers.json', (route) => route.fulfill({ status: 503, body: 'indisponível' }))
  await page.goto('/')

  await expect(page.getByText('Não foi possível carregar os clientes de teste.')).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Produtos' })).toBeVisible()
})
