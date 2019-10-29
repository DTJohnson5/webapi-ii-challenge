// Parameters
const express = require("express");
const dbase = require("../data/db.js");
const server = express();

// POST and GET operations

server.get("/", (req, res) => {
  dbase
    .find()
    .then(post => res.status(200).json(post))
    .catch(error => {
      console.log(error);
      res.status(500).json({ error: "The post could not be found." });
    });
});

server.get("/:id", (req, res) => {
  const id = req.params.id;
  dbase.findById(id).then(post => {
    if (post.length > 0) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ error: "That post does not exist." });
    }
  });
});

server.get("/:id/comments", (req, res) => {
  const id = req.params.id;
  dbase
    .findPostComments(id)
    .then(comments => {
      res.status(200).json(comments);
    })
    .catch(error => {
      res.status(500).json({ error: "That comment could not be found." });
    });
});

server.post("/", (req, res) => {
  const { title, contents } = req.body;
  if (title && contents) {
    dbase.insert({ title, contents }).then(({ id }) => {
      dbase.findById(id).then(([post]) => {
        res.status(200).json(post);
      });
    });
  } else {
    res.status(400).json({ error: "Please enter a title and some content." });
  }
});

server.post("/:id/comments", (req, res) => {
  const id = req.params.id;
  const comment = req.body;
  if (req.body.text) {
    dbase
      .findById(id)
      .then(response => {
        if (response.length == 0) {
          res
            .status(404)
            .json({ error: "The post with that ID does not exist." });
        }
      })
      .then(
        dbase
          .insertComment(comment)
          .then(obj => {
            dbase
              .findCommentById(obj.id)
              .then(response => {
                res.status(201).json(response);
              })
              .catch(error => {
                res
                  .status(500)
                  .json({ error: "The comments are not retrievable." });
              });
          })
          .catch(error => {
            res
              .status(500)
              .json({
                error:
                  "There was an error while saving the comment to the database."
              });
          })
      );
  } else {
      res.status(400).json({error: "Please provide text for the comment."})
  }
});

server.put("/:id", (req, res) => {
  const { title, contents } = req.body;
  const id = req.params.id;

  if (title || contents) {
    dbase.update(id, { title, contents }).then(({ id }) => {
      dbase.findById(id).then(([post]) => {
        res.status(200).json(post);
      });
    });
  } else {
    res.status(400).json({ error: "Please enter a title or some content." });
  }
});

server.delete("/:id", (req, res) => {
  const id = req.params.id;

  dbase
    .remove(id)
    .then(deleted => {
      if (deleted) {
        res.status(200).end();
      } else {
        res.status(404).json({ error: "That post ID does not exist." });
      }
    })
    .catch(error => {
      res.status(500).json({ error: "The post could not be removed." });
    });
});

// Export operation

module.exports = server;
