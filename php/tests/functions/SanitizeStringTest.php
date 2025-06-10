<?php

use PHPUnit\Framework\TestCase;

require_once __DIR__ . '/../../sanitize-string.php';

class SanitizeStringTest extends TestCase {
    public function test_removes_html_tags(): void {
        $input = "<b>Some text</b>";
        $expected = "Some text";
        $this->assertSame($expected, sanitize_string($input));
    }

    public function test_encodes_special_chars(): void {
        $input = "<p>&</p>";
        $expected = "&amp;";
        $this->assertSame($expected, sanitize_string($input));
    }

    public function test_quotes_not_replaced_by_default(): void {
        $input = "Some text 'text' & \"text\".";
        $expected = "Some text 'text' &amp; \"text\".";
        $this->assertSame($expected, sanitize_string($input));
    }

    public function test_quotes_replaced_when_flag_is_true(): void {
        $input = "Some text 'text' & \"text\".";
        $expected = "Some text &#39;text&#39; &amp; &#34;text&#34;.";
        $this->assertSame($expected, sanitize_string($input, true));
    }

    public function test_empty_string_returns_empty(): void {
        $this->assertSame('', sanitize_string(''));
    }

    public function test_plain_text_pass_through(): void {
        $this->assertSame('Some text', sanitize_string('Some text'));
    }

    public function test_only_tags_removed(): void {
        $input = "<script>alert('XSS');</script>";
        $expected = "alert('XSS');";
        $this->assertSame($expected, sanitize_string($input));
    }

    public function test_ampersand_encoded(): void {
        $this->assertSame('Text &amp; Text', sanitize_string('Text & Text'));
    }

    public function test_unicode_preserved(): void {
        $input = "Text & こんにちは";
        $expected = "Text &amp; こんにちは";
        $this->assertSame($expected, sanitize_string($input));
    }

    public function test_combined_case(): void {
        $input = "<i>'Taggy' & \"quoted\"</i>";
        $expected = "&#39;Taggy&#39; &amp; &#34;quoted&#34;";
        $this->assertSame($expected, sanitize_string($input, true));
    }
}