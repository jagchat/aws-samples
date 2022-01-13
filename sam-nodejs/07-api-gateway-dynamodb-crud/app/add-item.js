'use strict';

const AWS = require('aws-sdk')
const docClient = new AWS.DynamoDB.DocumentClient()

exports.handler = async function (event, context) {
    console.log("DemoDynamoDbAddItemLambda: Started..\n");

    let response = {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*'
        },
        body: null,
    };

    try {
        // if (event.httpMethod !== 'POST') {
        //     throw new Error(`add-item only accept POST method, you tried: ${event.httpMethod}`)
        // }        
        let result = await addItem(event);
        response.body = JSON.stringify(result);
    }
    catch (ex) {
        response.statusCode = 500;
        response.body = JSON.stringify({ error: ex.toString() });
    }

    console.log("DemoDynamoDbAddItemLambda: Completed..\n");
    return response;
};

const addItem = async (event) => {
    let response
    try {
        var config = JSON.parse(process.env.DemoDynamoDbParamStoreConfig);
        let body = event; //for lambda
        if (event.body) { //for api
            body = JSON.parse(event.body);
        }

        var album = body.Album
        var artist = body.Artist

        var params = {
            TableName: config.tablename,
            Item: { Album: album, Artist: artist }
        }

        response = await docClient.put(params).promise()
    } catch (err) {
        throw err
    }
    return response
}