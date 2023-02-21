import test, { expect } from '@playwright/test'
import { createTypebots } from 'utils/playwright/databaseActions'
import { parseDefaultGroupWithBlock } from 'utils/playwright/databaseHelpers'
import { defaultDateInputOptions, InputBlockType } from 'models'
import { createId } from '@paralleldrive/cuid2'

test.describe('Date input block', () => {
  test('options should work', async ({ page }) => {
    const typebotId = createId()
    await createTypebots([
      {
        id: typebotId,
        ...parseDefaultGroupWithBlock({
          type: InputBlockType.DATE,
          options: defaultDateInputOptions,
        }),
      },
    ])

    await page.goto(`/typebots/${typebotId}/edit`)

    await page.click('text=Preview')
    await expect(page.locator('[data-testid="from-date"]')).toHaveAttribute(
      'type',
      'date'
    )
    await expect(page.getByRole('button', { name: 'Send' })).toBeDisabled()
    await page.locator('[data-testid="from-date"]').fill('2021-01-01')
    await page.getByRole('button', { name: 'Send' }).click()
    await expect(page.locator('text="01/01/2021"')).toBeVisible()

    await page.click(`text=Pick a date...`)
    await page.click('text=Is range?')
    await page.click('text=With time?')
    await page.fill('#from', 'Previous:')
    await page.fill('#to', 'After:')
    await page.fill('#button', 'Go')

    await page.click('text=Restart')
    await expect(page.locator(`[data-testid="from-date"]`)).toHaveAttribute(
      'type',
      'datetime-local'
    )
    await expect(page.locator(`[data-testid="to-date"]`)).toHaveAttribute(
      'type',
      'datetime-local'
    )
    await page.locator('[data-testid="from-date"]').fill('2021-01-01T11:00')
    await page.locator('[data-testid="to-date"]').fill('2022-01-01T09:00')
    await page.getByRole('button', { name: 'Go' }).click()
    await expect(
      page.locator('text="01/01/2021, 11:00 AM to 01/01/2022, 09:00 AM"')
    ).toBeVisible()
  })
})
