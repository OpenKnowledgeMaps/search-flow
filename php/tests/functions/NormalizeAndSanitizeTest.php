<?php

use PHPUnit\Framework\TestCase;

require_once __DIR__ . '/../../normalize-and-sanitize.php';

class NormalizeAndSanitizeTest extends TestCase {
    public function testHtmlEntitiesAreDecoded(): void {
        $input = '&quot;Some string in quotes&quot;';
        $expected = '"Some string in quotes"';
        $this->assertSame($expected, normalize_and_sanitize($input));
    }

    public function testStripslashesAreRemoved(): void {
        $input = 'It\\\'s a test string\\!';
        $expected = "It's a test string!";
        $this->assertSame($expected, normalize_and_sanitize($input));
    }

    public function testHtmlTagsAreStripped(): void {
        $input = '<script>alert("XSS")</script>Some safe sting';
        $expected = 'alert("XSS")Some safe sting';
        $this->assertSame($expected, normalize_and_sanitize($input));
    }

    public function testCombinedSanitization(): void {
        $input = '&lt;b&gt;Bold\\\'s text&lt;/b&gt;';
        $expected = "Bold's text";
        $this->assertSame($expected, normalize_and_sanitize($input));
    }

    public function testSafeStringRemainsUntouched(): void {
        $input = 'Some safe sting';
        $expected = 'Some safe sting';
        $this->assertSame($expected, normalize_and_sanitize($input));
    }
}