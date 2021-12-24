
import { calcArm, calcMoment } from "../../common";

import {Interpreter, NumberObj, StringObj, TokenType, Tokenizer} from '@dteel/gpdsl';


const armFn = (popFn) => {
    const moment = popFn().value;
    const weight = popFn().value;
    return new NumberObj(null, calcArm(weight, moment), false);
}

const momentFn = (popFn) => {
    const arm = popFn().value;
    const weight = popFn().value;
    return new NumberObj(null, calcMoment(weight, arm), false);
}


function buildExternList(formF, aircraftList){
    let aircraft = aircraftList.find( ac => ac.id === formF.aircraft );
    if (!aircraft) aircraft={tail: '', weight:0, moment: 0};

    return [
        new StringObj('newline', '\n', true),
        new NumberObj("kit_length", formF.kit.length, true),
        new NumberObj("cargo_length", formF.cargo.length, true),

        new StringObj("tail", aircraft.tail, true),
        new NumberObj("basic_weight", aircraft.weight, true),
        new NumberObj("basic_moment", aircraft.moment, true),
        new NumberObj("basic_arm", calcArm(aircraft.weight, aircraft.moment), true),

        Interpreter.funcDef('calcArm', armFn, 'double', 'double', 'double'),
        Interpreter.funcDef('calcMoment', momentFn, 'double', 'double', 'double'),

        Interpreter.funcDef('kit_i_name',   (popFn)=>(new StringObj(null, formF.kit[popFn().value]?.name)), 'string', 'double'),
        Interpreter.funcDef('kit_i_weight', (popFn)=>(new NumberObj(null, formF.kit[popFn().value]?.weight)), 'double', 'double'),
        Interpreter.funcDef('kit_i_moment', (popFn)=>(new NumberObj(null, formF.kit[popFn().value]?.moment)), 'double', 'double'),
        Interpreter.funcDef('kit_i_arm',    (popFn)=>(new NumberObj(null, formF.kit[popFn().value]?.arm)), 'double', 'double'),

        Interpreter.funcDef('cargo_i_name',   (popFn)=>(new StringObj(null, formF.cargo[popFn().value]?.name)), 'string', 'double'),
        Interpreter.funcDef('cargo_i_weight', (popFn)=>(new NumberObj(null, formF.cargo[popFn().value]?.weight)), 'double', 'double'),
        Interpreter.funcDef('cargo_i_moment', (popFn)=>(new NumberObj(null, formF.cargo[popFn().value]?.moment)), 'double', 'double'),
        Interpreter.funcDef('cargo_i_arm',    (popFn)=>(new NumberObj(null, formF.cargo[popFn().value]?.arm)), 'double', 'double'),
    ];
}

function runCode(code, externs){
    const interpreter = new Interpreter();

    const result=interpreter.runCode(code, "string", true, false, externs);
    if (result.error){
        return result.error.message;
    }else{
        return result.exitObject.value;
    }
}

const markUpScriptCache=[];
let markUpSpanKeyIndex=0;
function markUpScript(code, externKeywords){
    let insideParen=0;
    const tab='   ';
    const space=' ';
    const output=[];
    let indentLevel=0;
    const tokenizer=new Tokenizer();
    const tokenList=tokenizer.tokenize(code);
    const newLine = () => {
        output.push('\n');
        for (let i=0;i<indentLevel;i++){
            output.push(tab);
        }
    }
    const outputTextWithColor = (text, color) => {
        output.push(<span key={markUpSpanKeyIndex++} style={{color: color}}>{text}</span>);
    }
    const outputText = (text) => {
        output.push(text);
    }
    const outputOp = (text)=>{
        if (output.length-1 >= 0){
            if (output[output.length-1]===space){
                output.pop();
            }
        }
        outputText(text);
    }
    const outputElse = () => {
        let popTo=null;
        for (let i=output.length-1; i>=0 ; i--){
            if (typeof output[i]!=="string" || (output[i].trim()!=="" && output[i]!=='}')){
                outputTextWithColor('else', '#90090');
                outputText(space);
                return;
            }
            if (output[i]==='}') break;
            popTo=i;
        }
        for (;output.length>popTo; output.pop());
        outputTextWithColor('else', '#900090');
        outputText(space);
    }
    for (const token of tokenList){
        switch (token.type){
            case TokenType.LineDelim:
                if (insideParen===0){
                    outputOp(';');
                    newLine();
                }else{
                    outputOp('; ');
                }
                break;
            case TokenType.NewLine:
                break;
            case TokenType.Double:
                outputTextWithColor('double', '#0000FF');
                outputText(space);
                break;
            case TokenType.String:
                outputTextWithColor('string', '#0000FF');
                outputText(space);
                break;
            case TokenType.Bool:
                outputTextWithColor('bool', '#0000FF');
                outputText(space);
                break;
         
            case TokenType.DoubleLiteral:
                outputTextWithColor(String(token.value), '#995050');
                break;

            case TokenType.StringLiteral:
                if (token.value.includes('"')){
                    outputTextWithColor("'"+token.value+"'", '#009900');
                }else{
                    outputTextWithColor('"'+token.value+'"', '#009900');
                }
                break;
            case TokenType.Ident:
                if (externKeywords?.find( w => w===token.value)){
                    outputTextWithColor(token.value, '#8f4c00');
                    outputText(space);
                }else{
                    outputTextWithColor(token.value, '#4090D0');
                    outputText(space);
                }
                break;
         
            case TokenType.True:
                outputTextWithColor('true', '#995050');
                break;
            case TokenType.False:
                outputTextWithColor('false', '#995050');
                break;
            case TokenType.Null:
                outputTextWithColor('null', '#995050');
                break;
         
            case TokenType.LeftParen:
                outputOp('(');
                insideParen++;
                break;
            case TokenType.RightParen:
                outputOp(')');
                outputText(space);
                insideParen--;
                break;
            case TokenType.LeftSqaure:
                outputOp('[');
                break;
            case TokenType.RightSqaure:
                outputOp(']');
                break;
         
            case TokenType.Comma:
                outputOp(', ');
                break;
            case TokenType.Dot:
                outputOp('.');
                break;
         
            case TokenType.Not:
                outputOp('!');
                break;
            case TokenType.And:
                outputOp(' && ');
                break;
            case TokenType.Or:
                outputOp(' || ');
                break;
            case TokenType.Plus:
                outputOp('+');
                break;
            case TokenType.Minus:
                outputOp('-');
                break;
            case TokenType.Divide:
                outputOp('/');
                break;
            case TokenType.Multiply:
                outputOp('*');
                break;
            case TokenType.Mod:
                outputOp('%');
                break;
            case TokenType.Exponent:
                outputOp('^');
                break;
         
            case TokenType.Question:
                outputOp('?');
                break;
            case TokenType.Colon:
                outputOp(':');
                break;
         
            case TokenType.Assignment:
                outputOp('=');
                break;
            case TokenType.Equals:
                outputOp('==');
                break;
            case TokenType.NotEquals:
                outputOp('!=');
                break;
            case TokenType.Lesser:
                outputOp('<');
                break;
            case TokenType.Greater:
                outputOp('>');
                break;
            case TokenType.LesserEquals:
                outputOp('<=');
                break;
            case TokenType.GreaterEquals:
                outputOp('>=');
                break;
         
            case TokenType.Min:
                outputTextWithColor('min', '#C05050');
                break;
            case TokenType.Max:
                outputTextWithColor('max', '#C05050');
                break;
            case TokenType.Abs:
                outputTextWithColor('abs', '#C05050');
                break;
            case TokenType.Clamp:
                outputTextWithColor('clamp', '#C05050');
                break;
            case TokenType.Floor:
                outputTextWithColor('floor', '#C05050');
                break;
            case TokenType.Ceil:
                outputTextWithColor('ceil', '#C05050');
                break;
         
            case TokenType.LCase:
                outputTextWithColor('lcase', '#C05050');
                break;
            case TokenType.UCase:
                outputTextWithColor('ucase', '#C05050');
                break;
            case TokenType.Trim:
                outputTextWithColor('trim', '#C05050');
                break;
            case TokenType.Len:
                outputTextWithColor('len', '#C05050');
                break;
            case TokenType.SubStr:
                outputTextWithColor('substr', '#C05050');
                break;
         
            case TokenType.While:
                outputTextWithColor('while ', '#900090');
                break;
            case TokenType.For:
                outputTextWithColor('for ', '#900090');
                break;
            case TokenType.Loop:
                outputTextWithColor('loop ', '#900090');
                break;
            case TokenType.If:
                outputTextWithColor('if ', '#900090');
                break;
            case TokenType.Else:
                outputElse();
                break;
            case TokenType.Break:
                outputTextWithColor('break', '#900090');
                break;
            case TokenType.LeftCurly:
                outputText('{');
                indentLevel++;
                newLine();
                break;
            case TokenType.RightCurly:
                if (output[output.length-1]===tab) output.pop();
                outputText('}');
                indentLevel--;
                newLine();
                break;
         
            case TokenType.Return:
                outputTextWithColor('return', '#D08070');
                outputText(space);
                break;
            case TokenType.Exit:
                outputTextWithColor('exit', '#D08070');
                outputText(space);
                break;
            default:
                break;
        }
    }
    
    let simplified=[];
    let accum="";
    for (let val of output){
        if (typeof val==="string"){
            accum+=val;
        }else{
            simplified.push(accum);
            accum="";
            simplified.push(val);
        }
    }
    if (accum.trim().length) simplified.push(accum);

    return simplified;
}

export {runCode, buildExternList, markUpScript};