const Problem=require("../models/problem");
const Submission=require("../models/submission");
const {getLanguageById,submitBatch,submitToken}=require("../utils/problemUtility");


const submitCode=async(req,res)=>{

    try{
       const userId = req.result._id;
       const problemId = req.params.id;

       let {code,language}=req.body;

       if(!userId||!code||!problemId||!language)
        return res.status(400).send("Some Field missing");

       if(language==='cpp')
        language='c++'

       // fethc the problem form database
       const problem=await Problem.findById(problemId);
       // testcases(Hidden)

       const submittedResult=await Submission.create({
        userId,
        problemId,
        code,
        language,
        status:'pending',
        testCasesTotal:problem.hiddenTestCases.length
       })

       // judge0 code ko submit karna hai

       const languageId=getLanguageById(language);

   const submissions = problem.hiddenTestCases.map((testcase)=>({
        source_code:code,
        language_id: languageId,
        stdin: testcase.input,
        expected_output: testcase.output
    }));

        const submitResult = await submitBatch(submissions);
        
        const resultToken = submitResult.map((value)=> value.token);
    
        const testResult = await submitToken(resultToken);

        // submittedRusult ko update karo
        let testCasesPassed=0;
        let runtime=0;
        let memory=0;
        let status='accepted';
        let errorMessage=null;

    for(const test of testResult){
        if(test.status_id==3){
           testCasesPassed++;
           runtime = runtime+parseFloat(test.time)
           memory = Math.max(memory,test.memory);
        }else{
          if(test.status_id==4){
            status = 'error'
            errorMessage = test.stderr
          }
          else{
            status = 'wrong'
            errorMessage = test.stderr
          }
        }
    }

    // store the result in Database in submiission
    submittedResult.status=status;
    submittedResult.testCasesPassed=testCasesPassed;
    submittedResult.errorMessage=errorMessage;
    submittedResult.runtime=runtime;
    submittedResult.memory=memory;

    await submittedResult.save();

    if(!req.result.problemSolved.includes(problemId)){
      req.result.problemSolved.push(problemId)
      await req.result.save();
    }

    const accepted = (status == 'accepted')
    res.status(201).json({
      accepted,
      totalTestCases: submittedResult.testCasesTotal,
      passedTestCases: testCasesPassed,
      runtime,
      memory
    });

    }
     catch(err){
      res.status(500).send("Internal Server Error "+ err);
    }
}

const runCode=async(req,res)=>{

    try{
       const userId = req.result._id;
       const problemId = req.params.id;

       let {code,language}=req.body;

       if(!userId||!code||!problemId||!language)
        return res.status(400).send("Some Field missing");


       const problem=await Problem.findById(problemId);

      if(language==='cpp')
        language='c++'



       

       const languageId=getLanguageById(language);

   const submissions = problem.visibleTestCases.map((testcase)=>({
        source_code:code,
        language_id: languageId,
        stdin: testcase.input,
        expected_output: testcase.output
    }));

        const submitResult = await submitBatch(submissions);
        
        const resultToken = submitResult.map((value)=> value.token);
    
        const testResult = await submitToken(resultToken);

    let testCasesPassed = 0;
    let runtime = 0;
    let memory = 0;
    let status = true;
    let errorMessage = null;

    for(const test of testResult){
        if(test.status_id==3){
           testCasesPassed++;
           runtime = runtime+parseFloat(test.time)
           memory = Math.max(memory,test.memory);
        }else{
          if(test.status_id==4){
            status = false
            errorMessage = test.stderr
          }
          else{
            status = false
            errorMessage = test.stderr
          }
        }
    }

   
  
   res.status(201).json({
    success:status,
    testCases: testResult,
    runtime,
    memory
   });        

   
    }
    catch(err){
      res.status(500).send("Internal Server Error "+ err);
    }
}

module.exports={submitCode,runCode};



   