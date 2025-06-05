<?php

use PHPUnit\Framework\TestCase;

require_once __DIR__ . '/../../sanitize-array-with-strings.php';

class SanitizeArrayWithStringsTest extends TestCase {
    public function testSanitizeHTMLSpecialChars(): void {
        $input = [
            '<script>alert("XSS attack number one!")</script>',
            'normal string',
            '<script>alert("XSS attack number two!")</script>'
        ];
        $expected = [
            '&lt;script&gt;alert(&quot;XSS attack number one!&quot;)&lt;/script&gt;',
            'normal string',
            '&lt;script&gt;alert(&quot;XSS attack number two!&quot;)&lt;/script&gt;'
        ];

        $this->assertSame($expected, sanitize_array_with_strings($input));
    }

    public function testSanitizeWithDifferentEncoding(): void {
        $input = ['Word & Word'];
        $expected = ['Word &amp; Word'];
        $this->assertSame($expected, sanitize_array_with_strings($input));
    }
}