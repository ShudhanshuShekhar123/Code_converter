const express = require("express")
const axios = require("axios")
const app = express()
const openai = require("openai")
require('dotenv').config();
app.use(express.json())

const apiopen = new openai({
  apiKey: process.env.OPENAI_API_KEY
});


app.post("/convert", (req,res)=>{
    const {prompt, code} = req.body
    // console.log(req.body)
    let newprompt;
    if(prompt ==="java"){
       newprompt = `Just convert the ${code} into ${prompt} and dont explain the code `
    }else 
    if(prompt ==="python"){
        newprompt = `Just convert   for the  ${code}  into ${prompt} and dont explain the code `
     }
     else 
     if(prompt ==="c++"){
         newprompt = `Just convert   for the  ${code}  into ${prompt} and dont explain the code `
      }
      else 
      if(prompt ==="javascript"){
          newprompt = `Just convert 
            for  the  ${code}  into ${prompt} and dont explain the code `
       }
  
 

    async function main() {

        const completion = await apiopen.chat.completions.create({
          messages: [{ role: 'user', content: newprompt}],
          model: 'gpt-3.5-turbo',
        });
      
        console.log(completion.choices);
        res.send(completion.choices[0].message.content)
      }
      
      main();



})



app.post("/choice",async (req, res)=>{

    const {code, prompt} = req.body
    let newcode ;
    if(prompt == "debug"){
        newcode = `tell the errors in the ${code} and then provide the corrrect code but keep the xplaination to the point and short`
    }else 
    if(prompt == "check quality"){
        newcode = `Please provide a  code quality assessment  in brief for the given code   ${code}. Consider the following parameters: 1. Code Consistency, 2.Code Performance,3.Code Documentation,4.Error Handling, 5.Code Testability, 6.Code Complexity, 7.Code Duplication, 8.Code Readability  and aslo provide evaluation score in % every parameter an at last give overall score.`
    }
      

    //Using chatgpt trxt completion api 


    // async function main() {

    //     const completion = await apiopen.chat.completions.create({
    //       messages: [{ role: 'user', content: newcode }],
    //       model: 'gpt-3.5-turbo',
    //     });
      
    //     console.log(completion.choices);
    //     res.send(completion.choices[0].message.content)
    //   }
      
    //   main();

    
    try {
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
          messages:[{"role":"user","content":newcode}],
          model:"gpt-3.5-turbo",
          temperature: 0.5,
        }, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          },
        });
    
        const codequality=response.data.choices[0].message.content;
        console.log(codequality)
        res.json({ codequality });
      } catch (error) {
        console.error('Error converting code:', error);
        res.status(500).json({ error});
      }
  

})











app.listen(7000, ()=>{
    console.log("listening at port 7000")
})