<?php
namespace App\Core;

class Validator {
    private array $errors = [];

    public function getErrors(): array {
        return $this->errors;
    }

    public function validate(string $val, string $name, array $validators): void {
        foreach($validators as $validator) {
            $reflectionClosure = new \ReflectionFunction($validator);
            if(!$validator($val)) {
                $this->errors[$name] = $reflectionClosure->getClosureUsedVariables()['name'];
                return;
            }
        }
    }

    public function isValid(): bool {
        return $this->errors === [];
    }

    public static function required(): callable {
        $name = __FUNCTION__;
        return function($var) use($name) { return $var !== '';};
    }

    public static function minLength(int $length): callable {
        $name = __FUNCTION__;
        return function($var) use($name, $length) { return strlen($var) >= $length; };
    }

    public static function maxLength(int $length): callable {
        $name = __FUNCTION__;
        return function($var) use($name, $length) { return strlen($var) <= $length; };
    }
}