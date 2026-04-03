import { type Page, type Locator, expect } from '@playwright/test'

export class ChatPage {
  readonly page: Page

  readonly header: Locator
  readonly headerTitle: Locator

  readonly welcomeScreen: Locator
  readonly welcomeTitle: Locator
  readonly welcomeSubtitle: Locator
  readonly suggestionButtons: Locator

  readonly messageTextarea: Locator
  readonly sendButton: Locator

  readonly messageList: Locator
  readonly typingIndicator: Locator

  readonly footer: Locator

  constructor(page: Page) {
    this.page = page

    this.header = page.getByTestId('header')
    this.headerTitle = page.getByTestId('header-title')

    this.welcomeScreen = page.getByTestId('welcome-screen')
    this.welcomeTitle = page.getByTestId('welcome-title')
    this.welcomeSubtitle = page.getByTestId('welcome-subtitle')
    this.suggestionButtons = page.locator('[data-testid^="suggestion-"]')

    this.messageTextarea = page.getByTestId('chat-input-textarea')
    this.sendButton = page.getByTestId('chat-send-button')

    this.messageList = page.getByTestId('message-list')
    this.typingIndicator = page.getByTestId('typing-indicator')

    this.footer = page.getByTestId('footer')
  }

  async goto() {
    await this.page.goto('/')
  }

  async sendMessage(text: string) {
    await this.messageTextarea.fill(text)
    await this.sendButton.click()
  }

  async sendViaEnter(text: string) {
    await this.messageTextarea.fill(text)
    await this.messageTextarea.press('Enter')
  }

  async waitForAssistantResponse() {
    await expect(this.typingIndicator).toBeVisible()
    await expect(this.typingIndicator).not.toBeVisible({ timeout: 30_000 })
  }

  async clickSuggestion(index: number) {
    await this.suggestionButtons.nth(index).click()
  }

  async clickSuggestionByText(text: string) {
    await this.suggestionButtons.filter({ hasText: text }).click()
  }

  getUserMessage(text: string): Locator {
    return this.messageList.getByTestId('message-user').filter({ hasText: text })
  }

  getAssistantMessage(): Locator {
    return this.messageList.getByTestId('message-assistant')
  }

  getFeedbackButtons(messageLocator: Locator) {
    return {
      positive: messageLocator.getByTestId('feedback-positive'),
      negative: messageLocator.getByTestId('feedback-negative'),
    }
  }
}
