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

//app.put("/repositories/:id",  (request, response) => {
app.put("/repositories/:id", findIndexRepository, (request, response) => {
  const { updatedRepository } = request.body;

  const repository  = repositories[repositoryIndex];

  //in update user can alter id and likes then send to put
  const repositoryUp = { 
    ...updatedRepository,
    likes: repository.like
  };

  repositories[repositoryIndex] = repositoryUp;

  return response.json(repositoryUp);  

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
