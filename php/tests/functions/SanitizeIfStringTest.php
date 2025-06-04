<?php

use PHPUnit\Framework\TestCase;

require_once __DIR__ . '/../../sanitize-if-string.php';

class SanitizeIfStringTest extends TestCase {
    public function testSanitizeHTMLSpecialChars(): void {
        $input = '<script>alert("XSS attack!")</script>';
        $expected = '&lt;script&gt;alert(&quot;XSS attack!&quot;)&lt;/script&gt;';
        $this->assertSame($expected, sanitize_if_string($input));
    }

    public function testSanitizeWithDifferentEncoding(): void {
        $input = 'Word & Word';
        $expected = 'Word &amp; Word';
        $this->assertSame($expected, sanitize_if_string($input));
    }

    public function testReturnWithoutChangesNonStringValue(): void {
        $input = 0;
        $this->assertSame($input, sanitize_if_string($input));

        $input = true;
        $this->assertSame($input, sanitize_if_string($input));
    }
}