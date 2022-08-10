import test, { expect } from '@playwright/test'
import {
  createTypebots,
  parseDefaultGroupWithBlock,
} from '../../services/database'
import { defaultNumberInputOptions, InputBlockType } from 'models'
import { typebotViewer } from '../../services/selectorUtils'
import cuid from 'cuid'
import { mockSessionApiCalls } from 'playwright/services/browser'

test.beforeEach(({ page }) => mockSessionApiCalls(page))

test.describe('Number input block', () => {
  test('options should work', async ({ page }) => {
    const typebotId = cuid()
    await createTypebots([
      {
        id: typebotId,
        ...parseDefaultGroupWithBlock({
          type: InputBlockType.NUMBER,
          options: defaultNumberInputOptions,
        }),
      },
    ])

    await page.goto(`/typebots/${typebotId}/edit`)

    await page.click('text=Preview')
    await expect(
      typebotViewer(page).locator(
        `input[placeholder="${defaultNumberInputOptions.labels.placeholder}"]`
      )
    ).toHaveAttribute('type', 'number')
    await expect(typebotViewer(page).locator(`button`)).toBeDisabled()

    await page.click(`text=${defaultNumberInputOptions.labels.placeholder}`)
    await page.fill('#placeholder', 'Your number...')
    await expect(page.locator('text=Your number...')).toBeVisible()
    await page.fill('#button', 'Go')
    await page.fill('[role="spinbutton"] >> nth=0', '0')
    await page.fill('[role="spinbutton"] >> nth=1', '100')
    await page.fill('[role="spinbutton"] >> nth=2', '10')

    await page.click('text=Restart')
    const input = typebotViewer(page).locator(
      `input[placeholder="Your number..."]`
    )
    await input.fill('-1')
    await input.press('Enter')
    await input.fill('150')
    await input.press('Enter')
    await input.fill('50')
    await input.press('Enter')
    await expect(typebotViewer(page).locator('text=50')).toBeVisible()
  })
})
