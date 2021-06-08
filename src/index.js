const express = require("express");

const { v4: uuid } = require("uuid");

const app = express();

app.use(express.json());

const repositories = [];

function findIndexRepository(request, response, next){
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0) {
    return response.status(404).json({ error: "Repository not found" });
  }

  request.repositoryIndex = repositoryIndex;

  next();
}


app.get("/repositories", (request, response) => {
  
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  };

  repositories.push(repository);

  return response.status(201).json(repository);
});

app.put("/repositories/:id", findIndexRepository, (request, response) => {
  const { title, url, techs }   = request.body;

  const { repositoryIndex }  = request;

  const repository  = repositories[repositoryIndex];

  repository.id = uuid();
  repository.title =  title;  
  repository.url = url;
  repository.techs = techs;

  repositories[repositoryIndex] = repository;

  return response.status(200).json(repository);  

});

app.delete("/repositories/:id", findIndexRepository, (request, response) => {
  const { repositoryIndex }  = request;

  repositories.splice(repositoryIndex,1);

  return response.status(204).send();
});


app.post("/repositories/:id/like",findIndexRepository, (request, response) => {

  const { repositoryIndex } = request;

  repositories[repositoryIndex].likes++;

  return response.status(201).json(repositories[repositoryIndex]);
});

module.exports = app;
