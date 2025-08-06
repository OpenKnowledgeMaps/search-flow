<?php

use PHPUnit\Framework\TestCase;

require_once __DIR__ . '/../../normalize-string.php';

class NormalizeStringTest extends TestCase {
    public function testHtmlEntitiesAreDecoded(): void {
        $input = 'Text &amp; Text &quot;Text&quot;';
        $expected = 'Text & Text "Text"';
        $this->assertEquals($expected, normalize_string($input));
    }

    public function testCombinedHtmlEntitiesAndSlashes(): void {
        $input = 'It\\\'s &quot;super&quot; &amp; Text';
        $expected = 'It\'s "super" & Text';
        $this->assertEquals($expected, normalize_string($input));
    }

    public function testEmptyString(): void {
        $this->assertEquals('', normalize_string(''));
    }
}