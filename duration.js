import React, { useState, useEffect } from 'react'
import { Box, Color } from 'ink'
import prettyMs from 'pretty-ms'

export default function Duration ({ duration, height }) {
  const expires = height ? `, expires: ${duration + height}` : ''
  return (
    <Box>
      Duration: {duration} ({prettyMs(duration * 30 * 1000)}){expires}
    </Box>
  )
}

