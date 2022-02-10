import test, { expect } from '@playwright/test'
import {
  createTypebots,
  parseDefaultBlockWithStep,
} from '../../services/database'
import { defaultPhoneInputOptions, InputStepType } from 'models'
import { typebotViewer } from '../../services/selectorUtils'
import { generate } from 'short-uuid'

test.describe('Phone input step', () => {
  test('options should work', async ({ page }) => {
    const typebotId = generate()
    await createTypebots([
      {
        id: typebotId,
        ...parseDefaultBlockWithStep({
          type: InputStepType.PHONE,
          options: defaultPhoneInputOptions,
        }),
      },
    ])

    await page.goto(`/typebots/${typebotId}/edit`)

    await page.click('text=Preview')
    await expect(
      typebotViewer(page).locator(
        `input[placeholder="${defaultPhoneInputOptions.labels.placeholder}"]`
      )
    ).toHaveAttribute('type', 'tel')
    await expect(typebotViewer(page).locator(`button`)).toBeDisabled()

    await page.click(`text=${defaultPhoneInputOptions.labels.placeholder}`)
    await page.fill('#placeholder', '+33 XX XX XX XX')
    await page.fill('#button', 'Go')
    await page.fill(
      `input[value="${defaultPhoneInputOptions.retryMessageContent}"]`,
      'Try again bro'
    )

    await page.click('text=Restart')
    await typebotViewer(page)
      .locator(`input[placeholder="+33 XX XX XX XX"]`)
      .fill('+33 6 73')
    await expect(typebotViewer(page).locator(`img`)).toHaveAttribute(
      'alt',
      'France'
    )
    await typebotViewer(page).locator('button >> text="Go"').click()
    await expect(
      typebotViewer(page).locator('text=Try again bro')
    ).toBeVisible()
    await typebotViewer(page)
      .locator(`input[placeholder="+33 XX XX XX XX"]`)
      .fill('+33 6 73 54 45 67')
    await typebotViewer(page).locator('button >> text="Go"').click()
    await expect(typebotViewer(page).locator('text=+33673544567')).toBeVisible()
  })
})
