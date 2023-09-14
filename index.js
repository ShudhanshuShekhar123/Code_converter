const express = require("express")
const axios = require("axios")
const app = express()
const cors = require('cors'); 
require('dotenv').config();
app.use(cors()); 
app.use(express.json())


const apiopen = new openai({
  apiKey: process.env.OPENAI_API_KEY
});


app.post("/convert",  async (req, res) => {
  const { prompt, code } = req.body

  // async function main() {

  //   const completion = await apiopen.chat.completions.create({
  //     messages: [{ role: 'user', content: `Just convert   for the  ${code}  into ${prompt} and dont explain the code ` }],
  //     model: 'gpt-3.5-turbo',
  //   });

  //   console.log(completion.choices);
  //   res.send(completion.choices[0].message.content)
  // }


  try {
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      messages: [{ role: 'user', content: `Just convert   for the  ${code}  into ${prompt} and dont explain the code ` }],
      model: "gpt-3.5-turbo",
    
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
    });

    const convertedcode = response.data.choices[0].message.content;
    console.log(convertedcode)
    res.json({ convertedcode });
  } catch (error) {
    console.error('Error converting code:', error);
    res.status(500).json({ error });
  }

  // main();

})

app.post("/choice", async (req, res) => {

  const { code, prompt } = req.body
  let newcode;
  if (prompt == "debug") {
    newcode = `tell the errors in the ${code} and then provide the corrrect code but keep the xplaination to the point and short`
  } else
    if (prompt == "check quality") {
      newcode = `Please provide a  code quality assessment  in brief for the given code   ${code}. Consider the following parameters: 1. Code Consistency, 2.Code Performance,3.Code Documentation,4.Error Handling, 5.Code Testability, 6.Code Complexity, 7.Code Duplication, 8.Code Readability  and aslo provide evaluation score in % every parameter an at last give overall score.`
    }

  try {
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      messages: [{ "role": "user", "content": newcode }],
      model: "gpt-3.5-turbo",
      temperature: 0.5,
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
    });

    const codequality = response.data.choices[0].message.content;
    console.log(codequality)
    res.json({ codequality });
  } catch (error) {
    console.error('Error converting code:', error);
    res.status(500).json({ error });
  }


})

app.listen(7000, () => {
  console.log("listening at port 7000")
})