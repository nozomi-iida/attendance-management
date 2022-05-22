package helpers

import "time"

func ISOTime2JP(isoTime time.Time) time.Time {
	return isoTime.In(time.FixedZone("JST", 9*60*60))
}
