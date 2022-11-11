import { baseURL } from '../const'

describe('visit home', () => {
  it('passes', () => {
    cy.visit('/')
    cy.url().should('eq', `${baseURL}/#/articles`)
  })
})
