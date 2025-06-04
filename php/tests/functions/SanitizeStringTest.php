<?php

use PHPUnit\Framework\TestCase;

require_once __DIR__ . '/../../sanitize-string.php';

class SanitizeStringTest extends TestCase {
    public function testSanitizeHtmlSpecialChars(): void {
        $input = '<script>alert("XSS attack!")</script>';
        $expected = '&lt;script&gt;alert(&quot;XSS attack!&quot;)&lt;/script&gt;';
        $this->assertSame($expected, sanitize_string($input));
    }

    public function testSanitizeWithDifferentEncoding(): void {
        $input = 'Word & Word';
        $expected = 'Word &amp; Word';
        $this->assertSame($expected, sanitize_string($input, ENT_QUOTES, 'UTF-8'));
    }

    public function testSanitizeNonStringValueReturnsDefinedDefault(): void {
        $input = ['wrong', 'data'];
        $default = 'default-value';
        $this->assertSame($default, sanitize_string($input, ENT_QUOTES, 'UTF-8', $default));
    }

    public function testSanitizeNullReturnsDefault(): void {
        $this->assertSame('', sanitize_string(null, ENT_QUOTES, 'UTF-8'));
    }

    public function testSanitizeIntegerReturnsDefault(): void {
        $this->assertSame('', sanitize_string(0, ENT_QUOTES, 'UTF-8'));
    }

    public function testSanitizeAlreadySafeString(): void {
        $input = 'Safe text';
        $this->assertSame('Safe text', sanitize_string($input));
    }
}