package config

import (
	"fmt"
	"log"
	"os"
	"time"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

// 配置 GORM
func NewGormDB() (*gorm.DB, error) {
	// 构建数据库连接字符串
	dbHost := os.Getenv("DB_HOST")
	dbPort := os.Getenv("DB_PORT")
	dbUser := os.Getenv("DB_USER")
	dbPassword := os.Getenv("DB_PASSWORD")
	dbName := os.Getenv("DB_NAME")
	dbSSLMode := os.Getenv("DB_SSL_MODE")
	if dbSSLMode == "" {
		dbSSLMode = "disable"
	}

	dsn := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=%s",
		dbHost, dbPort, dbUser, dbPassword, dbName, dbSSLMode)

	// 配置 GORM 日志
	logLevel := logger.Silent
	if os.Getenv("DEBUG_MODE") == "true" {
		logLevel = logger.Info
	}

	newLogger := logger.New(
		log.New(os.Stdout, "\r\n", log.LstdFlags), // 使用标准输出作为写入器
		logger.Config{
			SlowThreshold:             10 * time.Millisecond, // 设置慢查询阈值为 10ms
			LogLevel:                  logLevel,
			IgnoreRecordNotFoundError: false, // 记录未找到的错误
			Colorful:                  true,  // 启用彩色输出
		},
	)

	gormConfig := &gorm.Config{
		Logger:                 newLogger,
		PrepareStmt:            true, // 启用预编译语句缓存
		SkipDefaultTransaction: true, // 禁用默认事务
	}

	// 连接数据库
	db, err := gorm.Open(postgres.Open(dsn), gormConfig)
	if err != nil {
		return nil, fmt.Errorf("failed to connect database: %v", err)
	}

	// 获取底层的 *sql.DB
	sqlDB, err := db.DB()
	if err != nil {
		return nil, fmt.Errorf("failed to get database instance: %v", err)
	}

	// 设置连接池
	sqlDB.SetMaxIdleConns(10)           // 设置空闲连接池中的最大连接数
	sqlDB.SetMaxOpenConns(100)          // 设置打开数据库连接的最大数量
	sqlDB.SetConnMaxLifetime(time.Hour) // 设置连接可复用的最大时间

	return db, nil
}
