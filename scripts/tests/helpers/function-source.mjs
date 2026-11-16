import ts from 'typescript';
// Extract by syntax node, so neighboring functions and comments cannot leak into VM tests.
export function functionSource(source,name){
 const ast=ts.createSourceFile('fixture.js',source,ts.ScriptTarget.Latest,true,ts.ScriptKind.JS);
 const declaration=ast.statements.find(node=>ts.isFunctionDeclaration(node)&&node.name?.text===name);
 if(!declaration)throw Error('Missing function: '+name);
 return declaration.getText(ast);
}
