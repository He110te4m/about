import { baseURL } from '../const'

describe('visit home', () => {
  it('check route mode and default index', () => {
    cy.visit('/')

    cy.url()
      // expect router use hash history
      .should('match', new RegExp(`^${baseURL}/#`))
      // expect default index is articles
      .should('eq', `${baseURL}/#/articles`)
  })
})
