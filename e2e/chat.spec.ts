import { test, expect } from '@playwright/test'
import { ChatPage } from './chat_page_object'

test.describe('SOFIA Chat', () => {
  let chatPage: ChatPage

  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('load')
    await page.evaluate(() => localStorage.clear())
    await page.reload()
    await page.waitForLoadState('load')

    chatPage = new ChatPage(page)
  })

  test('exibe a tela inicial com titulo, subtitulo e sugestoes', async () => {
    await expect(chatPage.welcomeScreen).toBeVisible()
    await expect(chatPage.welcomeTitle).toHaveText('SOFIA')
    await expect(chatPage.welcomeSubtitle).toContainText(
      'Orientação sobre a carreira de Oficial de Chancelaria',
    )

    await expect(chatPage.suggestionButtons).toHaveCount(5)

    const expectedSuggestions = [
      'Promoção na carreira',
      'Remoção para o exterior',
      'Direitos e benefícios',
      'Licença para capacitação',
      'Concurso OC 2023',
    ]
    for (const text of expectedSuggestions) {
      await expect(chatPage.suggestionButtons.filter({ hasText: text })).toBeVisible()
    }
  })

  test('exibe o header com branding SOFIA', async () => {
    await expect(chatPage.header).toBeVisible()
    await expect(chatPage.headerTitle).toHaveText('SOFIA')
  })

  test('exibe o footer com disclaimer', async () => {
    await expect(chatPage.footer).toBeVisible()
    await expect(chatPage.footer).toContainText('ASOF')
    await expect(chatPage.footer).toContainText('Respostas com base em normas')
  })

  test('usuario envia mensagem via botao', async () => {
    await chatPage.sendMessage('Qual é o prazo para promoção?')

    await expect(chatPage.welcomeScreen).not.toBeVisible()
    await expect(chatPage.messageList).toBeVisible()

    const userMsg = chatPage.getUserMessage('Qual é o prazo para promoção?')
    await expect(userMsg).toBeVisible()
  })

  test('usuario envia mensagem via Enter', async () => {
    await chatPage.sendViaEnter('Teste de mensagem via Enter')

    await expect(chatPage.getUserMessage('Teste de mensagem via Enter')).toBeVisible()
  })

  test('Shift+Enter cria nova linha em vez de enviar', async () => {
    await chatPage.messageTextarea.fill('Linha 1')
    await chatPage.messageTextarea.press('Shift+Enter')
    await chatPage.messageTextarea.pressSequentially('Linha 2')

    await expect(chatPage.welcomeScreen).toBeVisible()
    await expect(chatPage.messageList).not.toBeVisible()
    await expect(chatPage.messageTextarea).toHaveValue('Linha 1\nLinha 2')
  })

  test('assistente responde com streaming apos mensagem do usuario', async () => {
    await chatPage.sendMessage('O que é remoção para o exterior?')

    await chatPage.waitForAssistantResponse()

    const assistantMsg = chatPage.getAssistantMessage().first()
    await expect(assistantMsg).toBeVisible()
    await expect(assistantMsg).not.toBeEmpty()
  })

  test('botao de sugestao envia mensagem pre-definida', async () => {
    await chatPage.clickSuggestion(0)

    await expect(chatPage.welcomeScreen).not.toBeVisible()
    await expect(chatPage.messageList).toBeVisible()
    await expect(chatPage.getUserMessage('Promoção na carreira')).toBeVisible()
  })

  test('botoes de feedback sao visiveis em mensagens do assistente', async () => {
    await chatPage.sendMessage('Direitos e benefícios do cargo')
    await chatPage.waitForAssistantResponse()

    const assistantMsg = chatPage.getAssistantMessage().first()
    const feedback = chatPage.getFeedbackButtons(assistantMsg)

    await expect(feedback.positive).toBeVisible()
    await expect(feedback.negative).toBeVisible()
  })

  test('feedback positivo desabilita ambos os botoes', async () => {
    await chatPage.sendMessage('Licença para capacitação')
    await chatPage.waitForAssistantResponse()

    const assistantMsg = chatPage.getAssistantMessage().first()
    const feedback = chatPage.getFeedbackButtons(assistantMsg)

    await feedback.positive.click()

    await expect(feedback.positive).toBeDisabled()
    await expect(feedback.negative).toBeDisabled()
  })

  test('feedback negativo desabilita ambos os botoes', async () => {
    await chatPage.sendMessage('Concurso OC 2023')
    await chatPage.waitForAssistantResponse()

    const assistantMsg = chatPage.getAssistantMessage().first()
    const feedback = chatPage.getFeedbackButtons(assistantMsg)

    await feedback.negative.click()

    await expect(feedback.positive).toBeDisabled()
    await expect(feedback.negative).toBeDisabled()
  })
})
