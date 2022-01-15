'use strict';

const AWS = require('aws-sdk')
const docClient = new AWS.DynamoDB.DocumentClient()

exports.handler = async function (event, context) {
    console.log("DemoDynamoDbGetAllLambda: Started..\n");

    let response = {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*'
        },
        body: null,
    };

    try {
        // if (event.httpMethod !== 'GET') {
        //     throw new Error(`get-all-items only accept GET method, you tried: ${event.httpMethod}`)
        // }
        let result = await getAllItems();
        response.body = JSON.stringify(result);
    }
    catch (ex) {
        response.statusCode = 500;
        response.body = JSON.stringify({ error: ex.toString() });
    }

    console.log("DemoDynamoDbGetAllLambda: Completed..\n");
    return response;
};

const getAllItems = async () => {
    let response
    try {
        console.log(`DemoDynamoDbGetAllLambda.getAllItems: fetching config..\n`);
        let config = JSON.parse(process.env.DemoDynamoDbParamStoreConfig);

        let params = {
            TableName: config.tablename
        }

        console.log(`DemoDynamoDbGetAllLambda.getAllItems: fetching data..\n`);
        response = await docClient.scan(params).promise()
    } catch (err) {
        throw err
    }
    return response
}