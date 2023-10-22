pnpm update --latest

# 1. Fehler
pnpm i -D typescript@5.1

# 2. Fehler
pnpm i marked@4.2.12

# 3. Fehler
# Error: Module not found: Error: Can't resolve 'core-js/es7/reflect' in '/home/user/angular-realworld-example-app/src'
pnpm i core-js@2.4.1

# --> pnpm start möglich

# 1. Fehler (test)
# Update test.ts to make it work -> copied file from angular-13-crud-example
sed -i 's|'zone.js/dist/long-stack-trace-zone'|'zone.js/testing'|' src/test.ts
sed -i -e '4,8d;14,20d;29,34d' src/test.ts

# Can't bind to 'formGroup' since it isn't a known property of 'form'
# Mit Version 14 Typed Forms notwendig
# https://github.com/angular/angular/issues/13721
# FormBuilder -> UntypedFormBuilder
#	FormGroup -> UntypedFormGroup
#	FormControl -> UntypedFormControl

sed -i -e 's/FormBuilder/UntypedFormBuilder/g' src/**/*.ts
sed -i -e 's/FormGroup/UntypedFormGroup/g' src/**/*.ts
sed -i -e 's/FormControl/UntypedFormControl/g' src/**/*.ts

# 2. Fehler (test)
# 'CanActivate' is deprecated

sed -i -e 's/ implements CanActivate//g' src/**/*.ts
sed -i -e 's/ CanActivate,//g' src/**/*.ts


# 3. Fehler (test)
# 'Resolve' is deprecated
sed -i -e 's/ implements Resolve<.*>//g' src/**/*.ts
sed -i -e 's/ Resolve,//g' src/**/*.ts

# 4. Fehler
# NullInjectorError: No provider for TestComponentRenderer
pnpm i zone.js@~0.13.0

# 5. Fehler
# error properties: Object({ longStack: 'TypeError: You provided 'undefined' where a stream was expected. You can provide an Observable, Promise, ReadableStream, Array, AsyncIterable, or Iterable.
# No solution found
