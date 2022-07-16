import { TypeExpressionParser } from "./typeExpressionParser";
import { Type } from "./types";

const NamePlaceholder = "?";
const DescriptionPlaceholder = "N / A";

export class EndpointDefinition {
    readonly name: string;
    readonly docs: string[] = [];
    readonly input: EndpointParameterDefinition[] = [];
    readonly output: EndpointParameterDefinition[] = [];
    readonly modifiers: EndpointModifiers;

    constructor(name: string, docs: string[], input: EndpointParameterDefinition[], output: EndpointParameterDefinition[], modifiers: EndpointModifiers) {
        this.name = name;
        this.docs = docs || [];
        this.input = input || [];
        this.output = output || [];
        this.modifiers = modifiers;
    }

    isConstructor(): boolean {
        return this.name == "constructor";
    }

    static fromJSON(json: {
        name: string,
        mutability: string,
        payableInTokens: string[],
        docs: string[],
        inputs: any[],
        outputs: []
    }): EndpointDefinition {
        json.name = json.name == null ? NamePlaceholder : json.name;
        json.payableInTokens = json.payableInTokens || [];
        json.docs = json.docs || [];
        json.inputs = json.inputs || [];
        json.outputs = json.outputs || [];

        let input = json.inputs.map(param => EndpointParameterDefinition.fromJSON(param));
        let output = json.outputs.map(param => EndpointParameterDefinition.fromJSON(param));
        let modifiers = new EndpointModifiers(json.mutability, json.payableInTokens);

        return new EndpointDefinition(json.name, json.docs, input, output, modifiers);
    }
}

export class EndpointModifiers {
    readonly mutability: string;
    readonly payableInTokens: string[];

    constructor(mutability: string, payableInTokens: string[]) {
        this.mutability = mutability || "";
        this.payableInTokens = payableInTokens || [];
    }

    isPayableInEGLD(): boolean {
        return this.isPayableInToken("EGLD");
    }

    isPayableInToken(token: string) {
        if (this.payableInTokens.includes(token)) {
            return true;
        }

        if (this.payableInTokens.includes(`!${token}`)) {
            return false;
        }

        if (this.payableInTokens.includes("*")) {
            return true;
        }

        return false;
    }

    isPayable() {
        return this.payableInTokens.length != 0;
    }

    isReadonly() {
        return this.mutability == "readonly";
    }
}

export class EndpointParameterDefinition {
    readonly name: string;
    readonly description: string;
    readonly type: Type;

    constructor(name: string, description: string, type: Type) {
        this.name = name;
        this.description = description;
        this.type = type;
    }

    static fromJSON(json: { name?: string, description?: string, type: string }): EndpointParameterDefinition {
        let parsedType = new TypeExpressionParser().parse(json.type);
        return new EndpointParameterDefinition(json.name || NamePlaceholder, json.description || DescriptionPlaceholder, parsedType);
    }
}
