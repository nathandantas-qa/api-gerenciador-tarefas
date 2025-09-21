const request = require('supertest');
const { expect, use } = require('chai');
// const chaiExclude = require('chai-exclude');
// use(chaiExclude);
require('dotenv').config();

const BASE_URL_GRAPHQL = process.env.BASE_URL_GRAPHQL || 'http://localhost:4000/graphql';

describe('API GraphQL de Tarefas', () => {
	let token;
	let secondaryToken;
	let userPrimaryId;

	before(async () => {
		// Registrar e logar usuário principal
		const primaryUser = { query: `mutation { registerUser(email: "user@example.com", password: "123456") { id email } }` };
		await request(BASE_URL_GRAPHQL).post('').send(primaryUser);

		const loginPrimary = {
			query: `mutation { loginUser(email: "user@example.com", password: "123456") { token user { id email } } }`
		};
		const resPrimary = await request(BASE_URL_GRAPHQL).post('').send(loginPrimary);
		token = resPrimary.body.data.loginUser.token;
		userPrimaryId = resPrimary.body.data.loginUser.user.id;

		// Registrar e logar usuário secundário
		const secondaryUser = { query: `mutation { registerUser(email: "user_readonly@example.com", password: "123456") { id email } }` };
		await request(BASE_URL_GRAPHQL).post('').send(secondaryUser);

		const loginSecondary = {
			query: `mutation { loginUser(email: "user_readonly@example.com", password: "123456") { token user { id email } } }`
		};
		const resSecondary = await request(BASE_URL_GRAPHQL).post('').send(loginSecondary);
		secondaryToken = resSecondary.body.data.loginUser.token;
	});

	it('não deve permitir acesso às tarefas sem um token', async () => {
		const query = { query: `query { tasks { id title description userId } }` };
		const resposta = await request(BASE_URL_GRAPHQL).post('').send(query);
		expect(resposta.body.errors[0].message).to.equal('Authentication required');
	});

	it('deve criar uma nova tarefa para o usuário autenticado', async () => {
		const mutation = {
			query: `mutation { createTask(title: "Tarefa Teste", description: "Deve criar uma nova tarefa para o usuário autenticado") { id title description userId completed } }`
		};
		const resposta = await request(BASE_URL_GRAPHQL)
			.post('')
			.set('Authorization', `Bearer ${token}`)
			.send(mutation);

		expect(resposta.body.data.createTask).to.include({
			title: 'Tarefa Teste',
			description: 'Deve criar uma nova tarefa para o usuário autenticado',
			completed: false,
			userId: userPrimaryId
		});
	});

	it('deve retornar todas as tarefas do usuário autenticado', async () => {
		const query = { query: `query { tasks { id title description userId completed } }` };
		const respostaPrimaryUser = await request(BASE_URL_GRAPHQL)
			.post('')
			.set('Authorization', `Bearer ${token}`)
			.send(query);

		expect(respostaPrimaryUser.body.data.tasks).to.be.an('array');
		expect(respostaPrimaryUser.body.data.tasks.every(task => task.userId === userPrimaryId)).to.be.true;

		const respostaSecondaryUser = await request(BASE_URL_GRAPHQL)
			.post('')
			.set('Authorization', `Bearer ${secondaryToken}`)
			.send(query);

		expect(respostaSecondaryUser.body.data.tasks).to.be.an('array');
		expect(respostaSecondaryUser.body.data.tasks.every(task => task.userId !== userPrimaryId)).to.be.true;
	});

	it('deve atualizar uma tarefa para o usuário autenticado', async () => {
		// Cria tarefa para garantir que existe
		const mutationCreate = {
			query: `mutation { createTask(title: "Atualizando Task", description: "deve atualizar uma tarefa para o usuário autenticado") { id } }`
		};
		const resCreate = await request(BASE_URL_GRAPHQL)
			.post('')
			.set('Authorization', `Bearer ${token}`)
			.send(mutationCreate);

		const taskId = resCreate.body.data.createTask.id;

		const mutationUpdate = {
			query: `mutation { updateTask(id: ${taskId}, title: "Atualizando Task", description: "deve atualizar uma tarefa para o usuário autenticado", completed: false) { id title completed } }`
		};
		const resposta = await request(BASE_URL_GRAPHQL)
			.post('')
			.set('Authorization', `Bearer ${token}`)
			.send(mutationUpdate);

		expect(resposta.body.data.updateTask.title).to.equal('Atualizando Task');
		expect(resposta.body.data.updateTask.completed).to.be.false;
	});

	it.only('não deve permitir que um usuário atualize uma tarefa que não é sua', async () => {
		// Cria tarefa com usuário principal
		const mutationCreate = {
			query: `mutation { createTask(title: "Tentando hackear", description: "não deve permitir que um usuário atualize uma tarefa que não é sua") { id } }`
		};
		const resCreate = await request(BASE_URL_GRAPHQL)
			.post('')
			.set('Authorization', `Bearer ${token}`)
			.send(mutationCreate);

		const taskId = resCreate.body.data.createTask.id;

    console.log('Task criada com ID:', taskId);

		const mutationUpdate = {
			query: `mutation { updateTask(id: ${taskId}, title: "Tentando hackear", description: "hackeado") { id title } }`
		};
		const resposta = await request(BASE_URL_GRAPHQL)
			.post('')
			.set('Authorization', `Bearer ${secondaryToken}`)
			.send(mutationUpdate);

		expect(resposta.body.errors[0].message).to.equal('You are not authorized to update this task');
	});
});
