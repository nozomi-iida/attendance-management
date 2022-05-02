import '@testing-library/jest-dom' // jestのアサーションがエラーになる場合は明示的にimport
import { describe, expect, test } from 'vitest'
import App from './App'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

describe('Simple working test', () => {

  test('should render correctly', () => {
    const {container} = render(<App />)
    expect(container.firstChild).toMatchSnapshot()
  })

  // extend-expectのmatcher[toBeInTheDocument]
  test('the title is visible', () => {
    render(<App />)
    expect(screen.getByText(/Hello Vite \+ React!/i)).toBeInTheDocument()
  })

  // jest-extendedのmatcher[toBeEmptyDOMElement]
  test('should increment count on click', async() => {
    render(<App />)
    await userEvent.click(screen.getByRole('button'))
    expect(await screen.findByText(/count is: 1/i)).not.toBeEmptyDOMElement()
  })
})