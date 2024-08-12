import express from "express";
import env from "dotenv";
import cors from "cors"; //helps manage cross-origin requests 

import { createClient } from "@supabase/supabase-js";//function to create a Supabase client for interacting with your database.

env.config();// loads environment variables from a .env file 

const supabase = createClient(process.env.DATABASE_URL, process.env.DATABASE_KEY);

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/articles", async (_, response) => {
    try {
      const { data, error } = await supabase.from("blog").select();
      console.log(data);
  
      return response.send(data);
    } catch (error) {
      return response.send({ error });
    }
}); //Fetches all articles from the blog table and sends them as a response
 

// Get an article

app.get("/articles/:id", async (request, response) => {
    try {
      const { data, error } = await supabase
        .from("posts")
        .select()
        .eq("id", request.params.id)
      console.log(data);
      return response.send(data);
    } catch (error) {
      return response.send({ error });
    }//Fetches a single article by its ID and sends it as a response
  });
  
app.post("/articles", async (request, response) => {
    try {
      console.log(request.body);
      const { data, error } = await supabase.from("blog").insert(request.body);
      if (error) {
        return response.status(400).json(error);
      }
      response.status(200).json(request.body);
    } catch (error) {
      response.send({ error });
    }
});//to post articles.
  
// Update an article
app.put("/articles/:id", async (request, response) => {
    console.log(request.params);
    try {
      const { data: updatedData, error: updatedError } = await supabase
        .from("blog")
        .update({
          title: request.body.title ? request.body.title : data[0].title,
          content: request.body.content ? request.body.content : data[0].content,
          tags: request.body.tags ? request.body.tags : data[0].tags,
        })
        .eq("id", request.params.id);
      const { data, err } = await supabase.from("blog").select();
      return response.status(200).send(data);
    } catch (error) {
      response.send({ error });
    }
  });
  
  // Delete an article
  app.delete("/articles/:id", async (request, response) => {
    try {
      const { data, error } = await supabase
        .from("blog")
        .delete()
        .eq("id", request.params.id);
      const { datar, errorr } = await supabase.from("blog").select();
      if (error) {
        return response.status(400).json(error);
      }
      return response.send(datar);
    } catch (error) {
      response.send({ error });
    }
  });

// Services 

app.listen(process.env.PORT, () =>
  console.log(
    new Date().toLocaleTimeString() +
      `: Server is running on port ${process.env.PORT}...`
  )
);

app.get("/", (_, response) =>
    response.json({ info: "Node.js, Express, and Postgres API" })
);//default
  
