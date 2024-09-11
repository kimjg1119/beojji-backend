import { describe, it, expect } from '@jest/globals';
import { downloadTemplate, grade } from './grade';

describe('Cobalt Assignment', () => {
  const assignment = 'cobalt';
  const code = `
    package kuplrg

    object Implementation extends Template {
      import Expr.*
      import Value.*

      def interp(expr: Expr, env: Env): Value = ???
      def eq(left: Value, right: Value): Boolean = ???
      def length(list: Value): BigInt = ???
      def map(list: Value, fun: Value): Value = ???
      def join(list: Value): Value = ???
      def filter(list: Value, fun: Value): Value = ???
      def app(fun: Value, args: List[Value]): Value = ???
    }
  `;

  it('should grade the cobalt assignment', () => {
    downloadTemplate(assignment);
    const result = grade(assignment, code);
    
    console.log(result);
  });
});
