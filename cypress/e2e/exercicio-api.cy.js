/// <reference types="cypress" />

import contrato from '../contracts/usuarios.contract'

describe('Testes da Funcionalidade Usuários', () => {

  let token
    beforeEach(() => {
        cy.token('vinicius_qa@ebac.com.br', 'teste').then(tkn => {
            token = tkn
        })
    });

  it('Deve validar contrato de usuários', () => {
    cy.request('usuarios').then(response => {
      return contrato.validateAsync(response.body)
  })
  });

  it('Deve listar usuários cadastrados', () => {
    cy.request({
      method: 'GET',
      url: 'usuarios'
    }).should((response) => {
        expect(response.status).equal(200)
    }) 
  });

  it('Deve cadastrar um usuário com sucesso', () => {
    const value = Math.floor(Math.random() * 10000)

    let nome = `Vinicius ${value}`
    let email = `teste${value}@hotmail.com`
    cy.cadastrarUsuario(token, nome, email, '12345')
    .should((response) => {
      expect(response.status).equal(201)
      expect(response.body.message).equal('Cadastro realizado com sucesso')
    }) 
  });

  it('Deve validar e-mail que já está sendo usado', () => {
    const value = Math.floor(Math.random() * 10000)

    let nome = `Vinicius ${value}`
    cy.cadastrarUsuario(token, nome, 'teste@hotmail.com', '12345')
            .then((response) => {
                expect(response.status).to.equal(400)
                expect(response.body.message).to.equal('Este email já está sendo usado')
            }) 
  });

  it('Deve validar um usuário com email inválido', () => {
    const value = Math.floor(Math.random() * 10000)

    let nome = `Vinicius ${value}`
    cy.cadastrarUsuario(token, nome, '5214', '12345')
            .then((response) => {
                expect(response.status).to.equal(400)
                expect(response.body.email).to.equal('email deve ser um email válido')
            }) 
  });

  it('Deve editar um usuário previamente cadastrado', () => {
    const value = Math.floor(Math.random() * 10000)

    let nome = `Vinicius ${value}`
    let email = `teste${value}@hotmail.com`
        cy.cadastrarUsuario(token, nome, email, '12345')
        .then(response => {
            let id = response.body._id

            cy.request({
                method: 'PUT', 
                url: `usuarios/${id}`,
                headers: {authorization: token}, 
                body: 
                {
                    "nome": nome,
                    "email": email,
                    "password": '85247',
                    "administrador": "true"
                  }
            }).then(response => {
                expect(response.body.message).to.equal('Registro alterado com sucesso')
            })
        }) 
  });

  it('Deve deletar um usuário previamente cadastrado', () => {
    const value = Math.floor(Math.random() * 10000)

    let nome = `Vinicius ${value}`
    let email = `teste${value}@hotmail.com`
        cy.cadastrarUsuario(token, nome, email, '12345')
        .then(response => {
            let id = response.body._id

            cy.request({
                method: 'DELETE', 
                url: `usuarios/${id}`,
                headers: {authorization: token}
            }).then(response => {
                expect(response.body.message).to.equal('Registro excluído com sucesso')
                expect(response.status).to.equal(200)
            })
        })  
  });


});
