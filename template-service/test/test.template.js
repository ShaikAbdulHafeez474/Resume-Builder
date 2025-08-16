
// test/template.test.js
const request = require("supertest");
const express = require("express");
const mongoose = require("mongoose");
const Template = require("../models/Template");
const templateRoutes = require("../routes/template.routes");

const app = express();
app.use(express.json());
app.use("/api/templates", templateRoutes);

beforeAll(async () => {
  await mongoose.connect("mongodb://127.0.0.1:27017/template_test", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  await Template.deleteMany(); // clean test DB
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Template API", () => {
  it("should create a new template", async () => {
    const res = await request(app)
      .post("/api/templates")
      .send({
        name: "Resume Template 1",
        previewURL: "http://example.com/preview.png",
        pageSize: "A4",
        sections: [{ type: "header", fields: ["name", "email"] }],
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("_id");
    expect(res.body.name).toBe("Resume Template 1");
  });

  it("should fetch all templates", async () => {
    const res = await request(app).get("/api/templates");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
